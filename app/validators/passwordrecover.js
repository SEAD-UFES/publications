'use strict'

const { isEmpty } = require('../helpers/is-empty')
const Validator = require('validator')

const validateBodyRequire = body => {
  const login = body && !isEmpty(body.login) ? body.login : ''
  let errors = {}

  if (Validator.isEmpty(login)) {
    errors.login = 'Este campo é requerido.'
  }

  if (!body.login) {
    errors.login = 'login é um campo requerido.'
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}

const validateBodyChange = body => {
  const password = body && !isEmpty(body.password) ? body.password : ''
  let errors = {}

  if (Validator.isEmpty(password)) {
    errors.password = 'Este campo é requerido.'
  }

  if (!Validator.isLength(password, { min: 6 })) {
    errors.password = 'Senha deve um mínimo de 6 caracteres.'
  }

  if (!body.password) {
    errors.password = 'password é um campo requerido.'
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}

module.exports = { validateBodyRequire, validateBodyChange }
