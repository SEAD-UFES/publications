/** @format */

'use strict'

const { isNumeric, isUUID } = require('validator')
const { isEmpty } = require('lodash')
const { findCourseIdByCallId } = require('../helpers/courseHelpers')
const { hasAnyPermission } = require('../helpers/permissionCheck')

const validateCallId = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //call exists
  if (typeof value !== 'undefined') {
    const call = await db.Call.findOne({ where: { id: value } })
    if (!call) return 'A chamada não existe.'
  }

  //no errors
  return null
}

const validateAssignmentId = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //assignment exists
  if (typeof value !== 'undefined') {
    const call = await db.Assignment.findOne({ where: { id: value } })
    if (!call) return 'O cargo não existe.'
  }

  //no errors
  return null
}

const validateRegionId = async (value, db, mode, item) => {
  //region exists
  if (typeof value !== 'undefined' && value !== null) {
    const region = await db.Region.findOne({ where: { id: value } })
    if (!region) return 'A Região não existe.'
  }

  //no errors
  return null
}

const validateRestrictionId = async (value, db, mode, item) => {
  //restriction exists
  if (typeof value !== 'undefined' && value !== null) {
    const restriction = await db.Restriction.findOne({ where: { id: value } })
    if (!restriction) return 'A Restrição não existe.'
  }

  //no errors
  return null
}

const validateQtd = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value is a number
  if (typeof value !== 'undefined' && !(Number.isInteger(value) || isNumeric(value))) {
    return 'Deve ser um número.'
  }

  //no errors
  return null
}

const validateReserve = (value, db, mode, item) => {
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

const validateUniqueVacancy = async (body, db, mode, item, errors) => {
  if (!errors.call_id && !errors.assignment_id && !errors.region_id && !errors.restriction_id) {
    // req.params.id está sendo passado em item, o ideal é que o nome fosse mais descritivo, item podem ser qualquer coisa
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item } } : {}

    const call_id = typeof body.call_id !== 'undefined' ? body.call_id : item.call_id
    const assignment_id = typeof body.assignment_id !== 'undefined' ? body.assignment_id : item.assignment_id
    const region_id = typeof body.region_id !== 'undefined' ? body.region_id : item ? item.region_id : null
    const restriction_id =
      typeof body.restriction_id !== 'undefined' ? body.restriction_id : item ? item.restriction_id : null

    const duplicate = await db.Vacancy.findOne({
      where: { ...whereIgnoreOwnId, call_id, assignment_id, region_id, restriction_id }
    })

    if (duplicate) return 'Essa Oferta de vaga já existe.'

    //no errors
    return null
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  const callIdError = await validateCallId(body.call_id, db, mode, item)
  if (callIdError) errors.call_id = callIdError

  const assignmentIdError = await validateAssignmentId(body.assignment_id, db, mode, item)
  if (assignmentIdError) errors.assignment_id = assignmentIdError

  const regionIdError = await validateRegionId(body.region_id, db, mode, item)
  if (regionIdError) errors.region_id = regionIdError

  const restrictionIdError = await validateRestrictionId(body.restriction_id, db, mode, item)
  if (restrictionIdError) errors.restriction_id = restrictionIdError

  const qtdError = validateQtd(body.qtd, db, mode, item)
  if (qtdError) errors.qtd = qtdError

  const reserveError = validateReserve(body.reserve, db, mode, item)
  if (reserveError) errors.reserve = reserveError

  const uniqueVacancyError = await validateUniqueVacancy(body, db, mode, item, errors)
  if (uniqueVacancyError) errors.id = uniqueVacancyError

  return !isEmpty(errors) ? errors : null
}

const validatePermission = async (req, db, item) => {
  let errors = {}

  //delete case
  if (req.method === 'DELETE') {
    const permission = 'vacancy_delete'
    const courseId = await findCourseIdByCallId(item.call_id, db)
    const errorMessage = 'O usuário não tem permissão para deletar essa Oferta de Vagas.'

    if (hasAnyPermission(req.user, permission, courseId)) return null

    errors.message = errorMessage
  }

  return !isEmpty(errors) ? errors : null
}

//Validate delete
const validateDelete = async (vacancy, models) => {
  const errors = {}

  //Vacancy não pode ser deletado se ele tiver sendo usado em uma inscrição
  const inscriptions = await models.Inscription.count({ where: { vacancy_id: vacancy.id } })
  if (inscriptions > 0) {
    errors.id = 'Esta Oferta de Vaga está sendo usada por Inscrições ativas.'
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validatePermission, validateDelete }
