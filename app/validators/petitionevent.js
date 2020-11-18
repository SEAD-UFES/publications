/** @format */

'use strict'

const { isUUID, isISO8601, isInt } = require('validator')

const models = require('../models')
const { isEmpty } = require('../helpers/is-empty.js')
const { findCourseIdByCalendarId } = require('../helpers/courseHelpers')
const { isAdmin, hasAnyPermission } = require('../helpers/permissionCheck')

const validateCalendarId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //validations (calendar and uniqueChild)
  if (typeof value !== 'undefined') {
    const calendar = await db.Calendar.findByPk(value)

    //calendar must exists
    if (!calendar) return 'O item de calendário não existe.'

    //PetitionEvent have to be unique child of calendar
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item.id } } : {}
    const PEs = await db.PetitionEvent.findAll({ where: { calendar_id: calendar.id, ...whereIgnoreOwnId } })
    if (PEs.length > 0) return 'O item de calendário já possui evento de recurso associado.'
  }

  //no errors
  return null
}

const validateInscriptionEventId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  if (typeof value !== 'undefined') {
    const inscriptionEvent = await db.InscriptionEvent.findByPk(value, { include: [db.Calendar] })

    //inscriptionEvent must exists
    if (!inscriptionEvent) return 'O evento de inscrição não existe.'
  }

  //no errors
  return null
}

const validateSameCall = async (body, db, mode, item, errors) => {
  if (!errors.calendar_id && !errors.inscriptionEvent_id) {
    const calendar_id = body.calendar_id
    const inscriptionEvent_id = body.inscriptionEvent_id

    //achar (calendar > call_id) do nosso petitionEvent
    const calendar = await db.Calendar.findByPk(calendar_id)
    const callId_from_calendar = calendar.call_id

    //achar (inscriptionEvent > calendar > call_id) de inscriptionEvent
    const inscriptionEvent = await db.InscriptionEvent.findByPk(inscriptionEvent_id)
    const ie_calendar = await db.Calendar.findByPk(inscriptionEvent.calendar_id)
    const callId_from_inscriptionEvent = ie_calendar.call_id

    //comparar
    if (callId_from_calendar !== callId_from_inscriptionEvent) {
      return 'Calendário e evento de inscrição não pertencem a mesma chamada.'
    }
  }

  //no errors
  return null
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo.

  const calendarIdError = await validateCalendarId(body.calendar_id, db, mode, item)
  if (calendarIdError) errors.calendar_id = calendarIdError

  const inscriptionEventIdError = await validateInscriptionEventId(body.inscriptionEvent_id, db, mode, item)
  if (inscriptionEventIdError) errors.inscriptionEvent_id = inscriptionEventIdError

  //validações de modelo.

  const sameCallError = await validateSameCall(body, db, mode, item, errors)
  if (sameCallError) {
    errors.message = sameCallError
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermissionCreate = async (req, db) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  //create case
  const permission = 'petitionevent_create'
  const courseId = (await findCourseIdByCalendarId(req.body.calendar_id, db)) || ''
  const errorMessage = 'O usuário não tem permissão para criar evento de recurso desse calendário.'

  if (hasAnyPermission(req.user, permission, courseId)) return null

  errors.message = errorMessage

  return !isEmpty(errors) ? errors : null
}

const validatePermissionUpdate = async (req, db, item) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  //update case
  const permission = 'petitionevent_update'
  const courseIdAtual = (await findCourseIdByCalendarId(item.calendar_id, db)) || ''
  const courseIdNovo =
    (await findCourseIdByCalendarId(req.body.calendar_id ? req.body.calendar_id : item.calendar_id, db)) || ''
  const errorMessage = 'O usuário não tem permissão para atualizar evento de recurso desse calendário.'

  //deve possuir permissão nos dois cursos para fazer a alteração. (update calendar_id case)
  const havePermissionAtual = hasAnyPermission(req.user, permission, courseIdAtual)
  const havePermissionNovo = hasAnyPermission(req.user, permission, courseIdNovo)

  if (havePermissionAtual && havePermissionNovo) return null

  errors.message = errorMessage

  return !isEmpty(errors) ? errors : null
}

const validatePermissionDelete = async (req, db, item) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  //delete case
  const permission = 'petitionevent_delete'
  const courseId = (await findCourseIdByCalendarId(item.calendar_id, db)) || ''
  const errorMessage = 'O usuário não tem permissão para deletar evento de inscrição desse calendário.'

  if (hasAnyPermission(req.user, permission, courseId)) return null

  errors.message = errorMessage

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validatePermissionCreate, validatePermissionUpdate, validatePermissionDelete }
