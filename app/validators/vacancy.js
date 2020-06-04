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

  return null
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

  return null
}

const validateRegionId = async (value, db, mode, item) => {
  //region exists
  if (typeof value !== 'undefined' && value !== null) {
    const region = await db.Region.findOne({ where: { id: value } })
    if (!region) return 'A Região não existe.'
  }

  return null
}

const validateRestrictionId = async (value, db, mode, item) => {
  //restriction exists
  if (typeof value !== 'undefined' && value !== null) {
    const restriction = await db.Restriction.findOne({ where: { id: value } })
    if (!restriction) return 'A Restrição não existe.'
  }

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
  if (typeof value !== 'undefined' && !Number.isInteger(Number(value)) ) {
    return 'Deve ser um número.'
  }

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

  return null
}

const validateUnique = async (body, db, mode, item, errors) => {

  console.log(body)

  if (!errors.call_id && !errors.assignment_id && !errors.region_id && !errors.restriction_id) {
    
    // req.params.id está sendo passado em item, o ideal é que o nome fosse mais descritivo, item podem ser qualquer coisa 
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item } } : {} 

    const { call_id, assignment_id } = body
    const region_id =      body && body.region_id         ? body.region_id      : null
    const restriction_id = body && body.resctriction_id   ? body.restriction_id : null

    console.log({
      where: {
        ...whereIgnoreOwnId,
        call_id,
        assignment_id,
        region_id,
        restriction_id
    }})

    const duplicate = await db.Vacancy.findOne({
      where: {
        ...whereIgnoreOwnId,
        call_id,
        assignment_id,
        region_id,
        restriction_id
      }
    })

    if (duplicate) return 'Essa vaga já existe para essa chamada.'

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

  const duplicateError= await validateUnique(body, db, mode, item, errors)
  if (duplicateError) errors.id = duplicateError

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody }
