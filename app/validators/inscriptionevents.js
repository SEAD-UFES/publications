/** @format */

'use strict'

const Sequelize = require('sequelize')
const { isUUID, isISO8601, isInt } = require('validator')

const models = require('../models')
const { findCourseIdByCalendarId } = require('../helpers/courseHelpers')
const { isAdmin, hasAnyPermission } = require('../helpers/permissionCheck')
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

    //IE have to be unique child of calendar
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item.id } } : {}
    const IEs = await db.InscriptionEvent.findAll({ where: { calendar_id: calendar.id, ...whereIgnoreOwnId } })
    if (IEs.length > 0) return 'O item de calendário já possui evento de inscrição associado.'
  }

  //no errors
  return null
}

const validateNumberOfInscriptionsAllowed = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value have to be a number
  if (typeof value === 'number') value = value.toString()
  if (typeof value !== 'undefined' && !isInt(value)) {
    return 'Este campo deve ser um número inteiro.'
  }

  //no errors
  return null
}

const validateAllowMultipleAssignments = (value, db, mode, item) => {
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

  //no errors
  return null
}

const validateAllowMultipleRegions = (value, db, mode, item) => {
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

  //no errors
  return null
}

const validateAllowMultipleRestrictions = (value, db, mode, item) => {
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

  //no errors
  return null
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const calendarIdError = await validateCalendarId(body.calendar_id, db, mode, item)
  if (calendarIdError) errors.calendar_id = calendarIdError

  const numberOfInscriptionsAllowedError = validateNumberOfInscriptionsAllowed(
    body.numberOfInscriptionsAllowed,
    db,
    mode,
    item
  )
  if (numberOfInscriptionsAllowedError) errors.numberOfInscriptionsAllowed = numberOfInscriptionsAllowedError

  const allowMultipleAssignmentsError = validateAllowMultipleAssignments(body.allowMultipleAssignments, db, mode, item)
  if (allowMultipleAssignmentsError) errors.allowMultipleAssignments = allowMultipleAssignmentsError

  const allowMultipleRegionsError = validateAllowMultipleRegions(body.allowMultipleRegions, db, mode, item)
  if (allowMultipleRegionsError) errors.allowMultipleRegions = allowMultipleRegionsError

  const allowMultipleRestrictionsError = validateAllowMultipleRestrictions(
    body.allowMultipleRestrictions,
    db,
    mode,
    item
  )
  if (allowMultipleRestrictionsError) errors.allowMultipleRestrictions = allowMultipleRestrictionsError

  //validações de modelo

  return !isEmpty(errors) ? errors : null
}

const validatePermission = async (req, db, item) => {
  let errors = {}

  if (isAdmin(req.user)) return null

  //create case
  if (req.method === 'POST') {
    const permission = 'inscriptionevent_create'
    const courseId = (await findCourseIdByCalendarId(req.body.calendar_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para criar evento de inscrição desse calendário.'

    if (hasAnyPermission(req.user, permission, courseId)) return null

    errors.message = errorMessage
  }

  //update case
  if (req.method === 'PUT') {
    const permission = 'inscriptionevent_update'
    const courseIdAtual = (await findCourseIdByCalendarId(item.calendar_id, db)) || ''
    const courseIdNovo =
      (await findCourseIdByCalendarId(req.body.calendar_id ? req.body.calendar_id : item.calendar_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para atualizar evento de inscrição desse calendário.'

    //deve possuir permissão nos dois cursos para fazer a alteração. (update calendar_id case)
    const havePermissionAtual = hasAnyPermission(req.user, permission, courseIdAtual)
    const havePermissionNovo = hasAnyPermission(req.user, permission, courseIdNovo)

    if (havePermissionAtual && havePermissionNovo) return null

    errors.message = errorMessage
  }

  //delete case
  if (req.method === 'DELETE') {
    const permission = 'inscriptionevent_delete'
    const courseId = (await findCourseIdByCalendarId(item.calendar_id, db)) || ''
    const errorMessage = 'O usuário não tem permissão para deletar evento de inscrição desse calendário.'

    if (hasAnyPermission(req.user, permission, courseId)) return null

    errors.message = errorMessage
  }

  return !isEmpty(errors) ? errors : null
}

//Validate delete
const validateDelete = async (inscriptionEvent, models) => {
  const errors = {}

  //Não pode ser deletado se tiver uma inscription associada.
  const inscriptions = await models.Inscription.count({ where: { inscriptionEvent_id: inscriptionEvent.id } })
  if (inscriptions > 0) {
    errors.id = 'Este evento de inscrição é dependência de inscrições ativas.'
    return errors
  }

  //Não pode ser deletado se estiver ligado algum PetitionEvent
  const petitionEvents = await models.PetitionEvent.count({ where: { inscriptionEvent_id: inscriptionEvent.id } })
  if (petitionEvents > 0) {
    errors.id = 'Este evento de inscrição é dependência de evento de recurso ativo.'
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validatePermission, validateDelete }
