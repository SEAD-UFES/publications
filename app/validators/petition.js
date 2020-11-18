/** @format */

'use strict'

const { isUUID } = require('validator')

const { isEmpty } = require('../helpers/is-empty.js')
const { filterVisibleByPetitionEventId } = require('../helpers/selectiveProcessHelpers')
const { checkIsUserInscription } = require('../helpers/inscriptionHelpers')

const validatePetitionEventId = async (value, db, mode, item) => {
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
    const pE = await db.PetitionEvent.findByPk(value)
    if (!pE) return 'O evento de inscrição não existe.'
  }

  //no errors
  return null
}

const validateInscriptionId = async (value, db, mode, item) => {
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
    const pE = await db.Inscription.findByPk(value)
    if (!pE) return 'A inscrição não existe.'
  }

  //no errors
  return null
}

const validateTitle = () => {
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
    return 'O título precisa ter entre 5 e 255 caracteres.'
  }

  //no errors
  return null
}

const validateDescription = () => {
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
    return 'O título precisa ter entre 20 e 512 caracteres.'
  }

  //no errors
  return null
}

//O recurso deve ser único
const validateUniqueInscriptionAndEvent = async () => {
  if (!errors.petitionEvent_id || !errors.inscription_id) {
    //determinar variaveis
    const petitionEventId = body.petitionEvent_id ? body.petitionEvent_id : item.petitionEvent_id
    const inscriptionId = body.inscription_id ? body.inscription_id : item.inscription_id

    //localizar duplicatas
    const numOfDuplicates = await db.Petition.count({
      where: { petitionEvent_id: petitionEventId, inscription_id: inscriptionId }
    })
    if (numOfDuplicates > 0) return 'O recurso para esse Evento/Inscrição já existe.'
  }
}

//incrição deve pertencer ao mesmo InscriptionEvent cadastrado no PetitionEvent
const validateInscriptionAndEvent = async (body, db, mode, item, errors) => {
  if (!errors.petitionEvent_id || !errors.inscription_id) {
    //determinar variaveis
    const petitionEventId = body.petitionEvent_id ? body.petitionEvent_id : item.petitionEvent_id
    const inscriptionId = body.inscription_id ? body.inscription_id : item.inscription_id

    //localizar InscriptionEvent_id cadatrado no PetitionEvent
    const petitionEvent = await db.PetitionEvent.findByPk(petitionEventId)
    const petitionEvent_inscriptionEventId = petitionEvent.inscriptionEvent_id

    //localizar inscriptionEvent_id da inscrição
    const inscription = await db.Inscription.findBkPk(inscriptionId)
    const inscription_InscriptionEventId = inscription.inscriptionEvent_id

    if (petitionEvent_inscriptionEventId !== inscription_InscriptionEventId)
      return 'Inscrição não pertence ao evento de inscrição correto.'
  }
}

//O recurso deve ser criado dentro do prazo do evento.
const validateCalendarRestrictions = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEvent_id) {
    const petitionEvent = await db.PetitionEvent.findByPk(body.PetitionEvent_id)
    const calendar = await db.Calendar.findByPk(petitionEvent.calendar_id)
    const calendarStatus = await calendar.calculateStatus()

    const status = {
      ag: 'Aguardando',
      atd: 'Atrasado por dependência',
      at: 'Atrasado',
      ad: 'Em andamento',
      cc: 'Concluído!'
    }

    if (calendarStatus === status['ag']) return 'O período de recurso não começou.'

    if (calendarStatus === status['atd']) return 'O evento de recurso está atrasado por uma dependência.'

    if (calendarStatus === status['at']) return 'O evento de recurso está atrasado.'

    //if (calendarStatus === status['ad']) Evento em andamento, sem problemas para criar recurso.

    if (calendarStatus === status['cc']) return 'O evento de recurso já terminou.'

    //no errors
    return null
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const petitionEventIdError = await validatePetitionEventId(body.petitionEvent_id, db, mode, item)
  if (petitionEventIdError) errors.petitionEvent_id = petitionEventIdError

  const inscriptionIdError = await validateInscriptionId(body.inscription_id, db, mode, item)
  if (inscriptionIdError) errors.inscription_id = inscriptionIdError

  const titleError = validateTitle(body.title, db, mode, item)
  if (titleError) errors.description = titleError

  const descriptionError = validateDescription(body.description, db, mode, item)
  if (descriptionError) errors.description = descriptionError

  //validações de modelo

  const inscriptionAndEventError = await validateInscriptionAndEvent(body, db, mode, item, errors)
  if (inscriptionAndEventError) {
    errors.message = inscriptionAndEventError
    return errors
  }

  const uniqueInscriptionAndEventError = await validateUniqueInscriptionAndEvent(body, db, mode, item, errors)
  if (uniqueInscriptionAndEventError) {
    errors.message = uniqueInscriptionAndEventError
    return errors
  }

  const calendarRestrictionsError = await validateCalendarRestrictions(body, db, mode, item, errors)
  if (calendarRestrictionsError) {
    errors.message = calendarRestrictionsError
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermissionCreate = async (req, db) => {
  const inscription = await db.Inscription.findByPk(req.body.inscription_id)
  const isMyInscription = checkIsUserInscription(inscription, req.user, db)

  //Im Admin. So, I have permission.
  if (isAdmin(user) && isMyInscription) return null

  //I have global permisson. So, I have permission.
  const permission = 'selectiveprocess_read'
  if (hasGlobalPermission(user, permission) && isMyInscription) return null

  //I have local Permission. So, I have permisson.
  const courseId = await findCourseIdByInscriptionEventId(inscription.inscriptionEvent_id, db)
  if (hasCoursePermission(user, permission, courseId) && isMyInscription) return null

  //The process is visible and the inscription is mine. So i have permission to create a petition for this inscription.
  const isVisible = await filterVisibleByPetitionEventId(req.body.petitionEvent_id, req.user, db)

  if (isVisible && isMyInscription) return null

  const errors = {}
  errors.message = 'O usuário não tem permissão para acessar esse recurso.'
  if (!isMyInscription) errors.inscription_id = 'Inscrição não pertence ao usuário.'

  //if no permission
  return errors
}

const validatePermissionRead = () => {}

module.exports = { validateBody, validatePermissionCreate }
