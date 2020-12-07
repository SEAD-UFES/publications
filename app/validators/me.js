/** @format */

'use strict'

const { isEmpty } = require('../helpers/is-empty.js')

//por hora não usado, dei um jeitinho nos errors de validação que estavam acontecendo.

const validateCPF = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //value have to be valid CPF.

  //value is unique on DB

  //no errors
  return null
}

const validateBodyPerson = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const validateCPFError = await validateCPF(body.petitionEvent_id, db, mode, item)
  if (validateCPFError) errors.cpf = validateCPFError

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBodyPerson }
