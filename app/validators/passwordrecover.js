'use strict'

const { isEmpty } = require('../helpers/is-empty')
const Validator = require('validator')

const validateBody = body => {
  const login = !isEmpty(body.login) ? body.login : ''
  let errors = {}

  if (Validator.isEmpty(login)) {
    errors.login = 'Este campo é requerido.'
  }

  if (!body.login) {
    errors.login = 'Login é um campo requerido.'
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}

module.exports = { validateBody }
