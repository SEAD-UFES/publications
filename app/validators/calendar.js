/** @format */

'use strict'

const { isISO8601 } = require('validator')
const { isEmpty } = require('lodash')
const moment = require('moment')

const { findCourseIdByCallId } = require('../helpers/courseInfo')
const { isAdmin, hasAnyPermission } = require('../helpers/permissionCheck')

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
  if (typeof value !== 'undefined' && value === '') {
    return 'Valor inválido.'
  }

  //Dado necessário para as proximas validações
  const calendar = await db.Calendar.findByPk(value)

  //if not null, calendar_id must exist
  if (typeof value !== 'undefined' && value !== null && !calendar) {
    return 'O item de calendário não existe.'
  }

  //calendar_id informada não pode criar uma dependencia circular
  if (typeof value !== 'undefined' && calendar && mode === 'update') {
    let fatherId = calendar.id
    let dependencyChain = [item.id]

    while (fatherId) {
      const isOnDependencyChain = dependencyChain.find(id => id === fatherId)
      if (!isOnDependencyChain) {
        dependencyChain = [...dependencyChain, fatherId]
        const nextCalendar = await db.Calendar.findByPk(fatherId)
        fatherId = nextCalendar ? nextCalendar.calendar_id : null
      } else return 'Dependecia circular detectada.'
    }
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
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

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

const validateTimePeriod = (body, db, mode, item, startError, endError) => {
  //Executar somente se não houver erro nos campos envolvidos.
  if (!startError && !endError) {
    //set date values
    const start = body.start ? body.start : item.start
    const end = body.end ? body.end : item.end ? item.end : start

    //convert to moment objects
    const startDate = moment(start).locale('pt-br')
    const endDate = moment(end).locale('pt-br')

    //Início deve ocorrer antes do fim.
    if (endDate < startDate) return 'Final do periodo deve ocorrer depois do início.'
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações dos campos

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

  //validações do modelo

  const timePeriodError = validateTimePeriod(body, db, mode, item, startError, endError)
  if (timePeriodError) errors.end = timePeriodError

  return !isEmpty(errors) ? errors : null
}

const validatePermission = async (req, db, item) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  //create case
  if (req.method === 'POST') {
    const permission = 'calendar_create'
    const courseId = (await findCourseIdByCallId(req.body.call_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para criar um calendário dessa chamada.'

    if (hasAnyPermission(req.user, permission, courseId)) return null

    errors.message = errorMessage
  }

  //update case
  if (req.method === 'PUT') {
    const permission = 'calendar_update'
    const courseIdAtual = (await findCourseIdByCallId(item.call_id, db)) || ''
    const courseIdNovo = (await findCourseIdByCallId(req.body.call_id ? req.body.call_id : item.call_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para atualizar um calendário dessa chamada.'

    //deve possuir permissão nos dois cursos para fazer a alteração. (update call_id case)
    const havePermissionAtual = hasAnyPermission(req.user, permission, courseIdAtual)
    const havePermissionNovo = hasAnyPermission(req.user, permission, courseIdNovo)

    if (havePermissionAtual && havePermissionNovo) return null

    errors.message = errorMessage
  }

  //delete case
  if (req.method === 'DELETE') {
    const permission = 'calendar_delete'
    const courseId = (await findCourseIdByCallId(item.call_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para deletar um calendário dessa chamada.'

    if (hasAnyPermission(req.user, permission, courseId)) return null

    errors.message = errorMessage
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validatePermission }
