/** @format */

'use strict'

const { isUUID } = require('validator')

const { isEmpty } = require('../helpers/is-empty.js')
const { isAdmin, hasGlobalPermission, hasCoursePermission } = require('../helpers/permissionCheck')

const validatePetitionId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //value must exists on db
  if (typeof value !== 'undefined') {
    const petition = await db.Petition.findByPk(value)
    if (!petition) return 'O recurso não existe.'
  }

  //no errors
  return null
}

const validateAccepted = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value is boolean
  if (typeof value !== 'undefined' && ![true, false, 0, 1].includes(value)) {
    return 'Deve ser verdadeiro ou falso.'
  }

  //no errors
  return null
}

const validateJustification = (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //tamanho mínimo
  if (typeof value !== 'undefined' && (typeof value !== 'string' || value.length <= 3 || value.length >= 255)) {
    return 'A justificativa precisa ter entre 5 e 1024 caracteres.'
  }

  //no errors
  return null
}

const validateUniqueReplyPerPetition = async (body, db, mode, item, errors) => {
  if (!errors.petition_id) {
    const petition_id = body.petition_id
    const numOfDuplicates = await db.PetitionReply.count({ where: { petition_id: petition_id } })
    if (numOfDuplicates > 0) return 'Já existe resposta para este recurso.'
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const petitionIdError = await validatePetitionId(body.petition_id, db, mode, item)
  if (petitionIdError) errors.petition_id = petitionIdError

  const acceptedError = validateAccepted(body.accepted, db, mode, item)
  if (acceptedError) errors.accepted = acceptedError

  const justificationError = validateJustification(body.justification, db, mode, item)
  if (justificationError) errors.justification = justificationError

  //validações de modelo

  const uniqueReplyError = await validateUniqueReplyPerPetition(body, db, mode, item, errors)
  if (uniqueReplyError) {
    errors.petition_id = uniqueReplyError
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermissionCreate = async (req, db) => {
  //includes
  const includeProcess = { model: db.SelectiveProcess, required: false }
  const includeCall = { model: db.Call, required: false, include: [includeProcess] }
  const includeCalendar = { model: db.Calendar, required: false, include: [includeCall] }
  const includeInscriptionEvent = { model: db.InscriptionEvent, required: false, include: [includeCalendar] }
  const includeInscription = { model: db.Inscription, required: false, include: [includeInscriptionEvent] }

  //query de calculo e derivados
  const petition = await db.Petition.findByPk(req.body.petition_id, { include: [includeInscription] })
  const courseId = petition.Inscription.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
  const permission = 'petitionreply_create'
  const user = req.user

  //Im Admin. So, I have permission.
  if (isAdmin(user)) return null

  //I have global permisson. So, I have permission.
  if (hasGlobalPermission(user, permission)) return null

  //I have local Permission. So, I have permisson.
  if (hasCoursePermission(user, permission, courseId)) return null

  const errors = {}
  errors.message = 'O usuário não tem permissão para responder a este recurso.'

  //if no permission
  return errors
}

const validatePermissionRead = async (req, db, item) => {
  //includes
  const includeProcess = { model: db.SelectiveProcess, required: false }
  const includeCall = { model: db.Call, required: false, include: [includeProcess] }
  const includeCalendar = { model: db.Calendar, required: false, include: [includeCall] }
  const includeInscriptionEvent = { model: db.InscriptionEvent, required: false, include: [includeCalendar] }
  const includeInscription = { model: db.Inscription, required: false, include: [includeInscriptionEvent] }
  const includePetition = { model: db.Petition, required: false, include: [includeInscription] }

  //query de calculo e derivados
  const petitionReply = await db.PetitionReply.findByPk(item.id, { include: [includePetition] })
  const courseId = petitionReply.Petition.Inscription.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
  const permission = 'petitionreply_read'
  const user = req.user
  const pr_personId = petitionReply.Petition.Inscription.person_id
  const us_personId = user.Person ? user.Person.id : null

  //Im Admin. So, I have permission.
  if (isAdmin(user)) return null

  //I have global permisson. So, I have permission.
  if (hasGlobalPermission(user, permission)) return null

  //I have local Permission. So, I have permisson.
  if (hasCoursePermission(user, permission, courseId)) return null

  //Is my petition. So, I can see the reply.
  if (pr_personId === us_personId) return null

  const errors = {}
  errors.message = 'O usuário não tem permissão para visualizar essa resposta à recurso.'

  //if no permission
  return errors
}

module.exports = {
  validateBody,
  validatePermissionCreate,
  validatePermissionRead
}
