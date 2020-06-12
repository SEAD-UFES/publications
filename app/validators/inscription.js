/** @format */

'use strict'

const Sequelize = require('sequelize')
const { isUUID } = require('validator')

const { isEmpty } = require('../helpers/is-empty.js')
const { isAdmin, hasGlobalPermission, hasCoursePermission, hasAnyPermission } = require('../helpers/permissionCheck')
const { findCourseIdByInscriptionEventId } = require('../helpers/courseInfo')

const validateInscriptionEventId = async (value, db, mode, item) => {
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
    const iE = await db.InscriptionEvent.findByPk(value)
    if (!iE) return 'O evento de inscrição não existe.'
  }

  //no errors
  return null
}

const validatePersonId = async (value, db, mode, item) => {
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
    const person = await db.Person.findByPk(value)
    if (!person) return 'Dados pessoais não existem.'
  }

  //no errors
  return null
}

const validateVacancyId = async (value, db, mode, item) => {
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
    const vacancy = await db.Vacancy.findByPk(value)
    if (!vacancy) return 'A Oferta de vaga não existe.'
  }

  //no errors
  return null
}

const validateUnique_IEv_Per_Vac = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEventIdError && !errors.personIdError && !errors.vacancyIdError) {
    const inscriptionEvent_id = body.inscriptionEvent_id
    const person_id = body.person_id
    const vacancy_id = body.vacancy_id

    const numOfDuplicates = await db.Inscription.count({
      where: {
        inscriptionEvent_id: inscriptionEvent_id,
        person_id: person_id,
        vacancy_id: vacancy_id
      }
    })
    if (numOfDuplicates > 0) return 'Essa inscrição já está cadastrada.'
  }

  //no errors
  return null
}

const validatePossibleInscription = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEventIdError) {
    const inscriptionEvent = await db.InscriptionEvent.findByPk(body.inscriptionEvent_id)
    const calendar = await db.Calendar.findByPk(inscriptionEvent.calendar_id)
    const calendarStatus = await calendar.calculateStatus()

    const status = {
      ag: 'Aguardando',
      atd: 'Atrasado por dependência',
      at: 'Atrasado',
      ad: 'Em andamento',
      cc: 'Concluído!'
    }

    if (calendarStatus === status['ag']) return 'O período de inscrição não começou.'

    if (calendarStatus === status['atd']) return 'O evento de inscrição está atrasado por uma dependência.'

    if (calendarStatus === status['at']) return 'O evento de inscrição está atrasado.'

    //if (calendarStatus === status['ad']) Evento em andamento, sem problemas para se inscrever.

    if (calendarStatus === status['cc']) return 'O evento de inscrição já terminou.'

    //no errors
    return null
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const inscriptionEventIdError = await validateInscriptionEventId(body.inscriptionEvent_id, db, mode, item)
  if (inscriptionEventIdError) errors.inscriptionEvent_id = inscriptionEventIdError

  const personIdError = await validatePersonId(body.person_id, db, mode, item)
  if (personIdError) errors.person_id = personIdError

  const vacancyIdError = await validateVacancyId(body.vacancy_id, db, mode, item)
  if (vacancyIdError) errors.vacancy_id = vacancyIdError

  //validações de modelo

  const uniqueError = await validateUnique_IEv_Per_Vac(body, db, mode, item, errors)
  if (uniqueError) {
    errors.message = uniqueError
    return errors
  }

  const possibleInscriptionError = await validatePossibleInscription(body, db, mode, item, errors)
  if (possibleInscriptionError) {
    errors.message = possibleInscriptionError
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermission = async (req, db, item) => {
  let errors = {}

  //create case
  if (req.method === 'POST') {
    //Para criar inscrição é necessário apenas esar logado. (Caso coberto pelo middleware)
  }

  //delete case
  if (req.method === 'DELETE') {
    const permission = 'inscription_delete'
    const courseId = (await findCourseIdByInscriptionEventId(item.inscriptionEvent_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para deletar essa inscrição.'

    //if have permission
    if (hasAnyPermission(req.user, permission, courseId)) return null

    //Or if the inscription is mine
    const isVisible = await filterVisibleByInscriptionEventId(item.inscriptionEvent_id, user, db)
    const isMyInscription = checkIsUserInscription(inscription, user, db)
    if (isVisible && isMyInscription) return null

    errors.message = errorMessage
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermissionRead = async (inscription, user, db) => {
  //Im Admin. So, I have permission.
  if (isAdmin(user)) return null

  //I have global permisson. So, I have permission.
  const permission = 'selectiveprocess_read'
  if (hasGlobalPermission(user, permission)) return null

  //I have local Permission. So, I have permisson.
  const courseId = await findCourseIdByInscriptionEventId(inscription.inscriptionEvent_id, db)
  if (hasCoursePermission(user, permission, courseId)) return null

  //The process is visible and the inscription is mine. So i have permission.
  const isVisible = await filterVisibleByInscriptionEventId(inscription.inscriptionEvent_id, user, db)
  const isMyInscription = checkIsUserInscription(inscription, user, db)
  if (isVisible && isMyInscription) return null

  //if no permission
  return { message: 'O usuário não tem permissão para acessar esse recurso.' }
}

module.exports = { validateBody, validatePermission, validatePermissionRead }
