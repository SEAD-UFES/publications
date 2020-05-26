/** @format */

'use strict'

const { isNumeric } = require('validator')
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
    const call = await db.Call.findOne({ where: { id: value } })
    if (!call) return 'A chamada não existe.'
  }
}

const validateAssignmentId = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //assignment exists
  if (typeof value !== 'undefined') {
    const call = await db.Assignment.findOne({ where: { id: value } })
    if (!call) return 'O cargo não existe.'
  }
}

const validateRegionId = async (value, db, mode, item) => {
  //region exists
  if (typeof value !== 'undefined' && value !== null) {
    const region = await db.Region.findOne({ where: { id: value } })
    if (!region) return 'A Região não existe.'
  }
}

const validateRestrictionId = async (value, db, mode, item) => {
  //restriction exists
  if (typeof value !== 'undefined' && value !== null) {
    const restriction = await db.Restriction.findOne({ where: { id: value } })
    if (!restriction) return 'A Restrição não existe.'
  }
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

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody }
