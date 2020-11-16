/** @format */

'use strict'

const { isUUID, isISO8601, isInt } = require('validator')

const models = require('../models')
const { isAdmin } = require('../helpers/permissionCheck')
const { isEmpty } = require('../helpers/is-empty.js')

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

    //AppealEvent have to be unique child of calendar
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item.id } } : {}
    const AEs = await db.AppealEvent.findAll({ where: { calendar_id: calendar.id, ...whereIgnoreOwnId } })
    if (AEs.length > 0) return 'O item de calendário já possui evento de recurso associado.'
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
  if (!errors.calendarIdError && !errors.inscriptionEventIdError) {
    const calendar_id = body.calendar_id
    const inscriptionEvent_id = body.inscriptionEvent_id

    //achar (calendar > call_id) do nosso appealEvent
    const calendar = await db.Calendar.findByPk(calendar_id)
    const callId_from_calendar = calendar.call_id

    //achar (inscriptionEvent > calendar > call_id) de inscriptionEvent
    const inscriptionEvent = await db.inscriptionEvent.findByPk(inscriptionEvent_id)
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

const validatePermissionCreate = async (req, db, item) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validatePermissionCreate }
