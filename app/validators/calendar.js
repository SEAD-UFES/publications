/** @format */

'use strict'

const { isISO8601 } = require('validator')
const { isEmpty } = require('lodash')

const validateCallId = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //call exists
  if (typeof value !== 'undefined') {
    const call = await db.Call.findByPk(value)
    if (!call) return 'A chamada não existe.'
  }
}

const validateCalendarId = async (value, db, mode, item) => {
  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //calendar exists
  if (typeof value !== 'undefined') {
    const call = await db.Calendar.findByPk(value)
    if (!call) return 'O item de calendário não existe.'
  }
}

const validateName = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }
}

const validateReady = (value, db, mode, item) => {
  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value is boolean
  if (typeof value !== 'undefined' && value !== true && value !== false && value !== 1 && value !== 0) {
    return 'Deve ser verdadeiro ou falso.'
  }
}

const validateStart = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value is a date
  if (typeof value !== 'undefined' && !isISO8601(value)) {
    return 'Formato de data inválido.'
  }
}

const validateEnd = (value, db, mode, item) => {
  //value is valid
  if (typeof value !== 'undefined' && value === '') {
    return 'Este campo é requerido.'
  }

  //value is a date
  if (typeof value !== 'undefined' && value !== null && !isISO8601(value)) {
    return 'Formato de data inválido.'
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  const callIdError = await validateCallId(body.call_id, db, mode, item)
  if (callIdError) errors.call_id = callIdError

  const calendarIdError = await validateCalendarId(body.calendar_id, db, mode, item)
  if (calendarIdError) errors.calendar_id = calendarIdError

  const nameError = validateName(body.name, db, mode, item)
  if (nameError) errors.name = nameError

  const readyError = validateReady(body.ready, db, mode, item)
  if (readyError) errors.ready = readyError

  const startError = validateStart(body.start, db, mode, item)
  if (startError) errors.start = startError

  const endError = validateEnd(body.end, db, mode, item)
  if (endError) errors.end = endError

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody }
