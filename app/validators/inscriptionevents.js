/** @format */

'use strict'

const Sequelize = require('sequelize')
const { isUUID, isNumeric, isISO8601, isInt } = require('validator')

const models = require('../models')
const { findCourseIdByCalendarId } = require('../helpers/courseInfo')
const { isAdmin, hasAnyPermission } = require('../helpers/permissionCheck')
const { isEmpty } = require('../helpers/is-empty.js')

const validBool = value => [true, false, 0, 1].includes(value)

const validate = async ({ body, method, params }) => {
  try {
    if (method === 'PUT')
      return {
        ...(await validateId(params.id)),
        ...(await validateBody(body, params.id))
      }
    else return await validateBody(body)
  } catch (e) {
    console.log('Error in InscrptionEvent validation.')
    throw e
  }
}

const validateId = async id => {
  const errors = {}

  if (isUUID(id)) {
    try {
      const foundInscription = await models.InscriptionEvent.findById(id)
      if (isEmpty(foundInscription)) errors.id = 'Não há inscrições correspondentes a esse identificador.'
    } catch (e) {
      errors.id = 'Não foi possível encontrar essa inscrição no banco de dados.'
    }
  } else errors.id = 'A inscrição enviada não tem um identificador válido.'

  return errors
}

const validateBody = async (
  {
    startDate,
    endDate,
    numberOfInscriptionsAllowed,
    allowMultipleAssignments,
    allowMultipleRegions,
    allowMultipleRestrictions
  },
  hasId
) => {
  const ignoreOwnId = hasId ? { id: { [Sequelize.Op.not]: hasId } } : {}
  const errors = {}

  if (!startDate || !isISO8601(startDate))
    errors.startDate = 'A inscrição precisa de uma data de abertura válida, posterior a data atual.' // onde eu checo ser posterior ????

  if (!endDate || !isISO8601(endDate))
    errors.endDate = 'A inscrição precisa de uma data de fechamento válida, posterior a data atual.' // onde eu checo ser posterior ????

  if (!errors.startDate && !errors.endDate && startDate >= endDate)
    errors.startDate = errors.endDate = 'A data de fechamento da inscrição precisa ser posterior a data de abertura.'

  if (typeof numberOfInscriptionsAllowed !== 'undefined' && !Number.isInteger(numberOfInscriptionsAllowed))
    errors.numberOfInscriptionsAllowed = 'O número de inscrições permitidas precisa ser um número inteiro.'

  if (typeof allowMultipleAssignments !== 'undefined' && !validBool(allowMultipleAssignments))
    errors.allowMultipleAssignments = 'É necessário definir se é permitido fazer mais de uma inscrição por atribuição.'

  if (typeof allowMultipleRegions !== 'undefined' && !validBool(allowMultipleRegions))
    errors.allowMultipleRegions = 'É necessário definir se é permitido fazer mais de uma inscrição por região.'

  if (typeof allowMultipleRestrictions !== 'undefined' && !validBool(allowMultipleRestrictions))
    errors.allowMultipleRestrictions = 'É necessário definir se é permitido fazer mais de uma inscrição por restrição.'

  return errors
}

const validateCalendarId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //calendar must exists
  if (typeof value !== 'undefined') {
    const calendar = await db.Calendar.findByPk(value)
    if (!calendar) return 'O item de calendário não existe.'
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
  if (!isInt(value)) {
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

const validateBodyV2 = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const calendarIdError = await validateCalendarId(body.calendar_id, db, mode, item)
  if (calendarIdError) errors.calendar_id = calendarIdError

  const numberOfInscriptionsAllowedError = validateNumberOfInscriptionsAllowed(body.calendar_id, db, mode, item)
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

module.exports = { validate, validateBodyV2, validatePermission }
