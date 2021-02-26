/** @format */

const Validator = require('validator')
const { isEmpty } = require('../helpers/is-empty.js')
const { isValidCPF } = require('../helpers/validatorHelpers')

//validações de campo.

const validateName = (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //no errors
  return null
}

const validateSurname = (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //no errors
  return null
}

const validateCPF = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //has to be a valid cpf
  if (!isValidCPF(value)) {
    return 'CPF inválido.'
  }

  //value can not be on DB
  const numFound = await db.Person.count({ where: { cpf: value } })
  if (numFound > 0) {
    return 'CPF já cadastrado no sistema.'
  }

  //no errors
  return null
}

const validateMotherName = (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //no errors to return
  return null
}

const validateLogin = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //value is a email
  if (!Validator.isEmail(value)) {
    return 'Este campo precisa ser um email.'
  }

  //value can not be on DB
  const numFound = await db.User.count({ where: { login: value } })
  if (numFound > 0) {
    return 'Login já cadastrado no sistema.'
  }

  //no errors
  return null
}

const validatePassword = async (value, db, mode, item) => {
  //value exists and its necessary
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  if (!Validator.isLength(value, { min: 6 })) {
    return 'Senha deve um mínimo de 6 caracteres.'
  }

  //no errors
  return null
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validação dos objetos.
  if (!body.User) errors.user = 'Body não contém o objecto User.'
  if (!body.Person) errors.person = 'Body não contém o objecto Person.'
  if (!isEmpty(errors)) return errors

  //validação dos campos.
  const nameError = validateName(body.Person.name, db, mode, item)
  if (nameError) errors.name = nameError

  const surnameError = validateSurname(body.Person.surname, db, mode, item)
  if (surnameError) errors.surname = surnameError

  const cpfError = await validateCPF(body.Person.cpf, db, mode, item)
  if (cpfError) errors.cpf = cpfError

  const motherNameError = validateMotherName(body.Person.motherName, db, mode, item)
  if (motherNameError) errors.motherName = motherNameError

  const loginError = await validateLogin(body.User.login, db, mode, item)
  if (loginError) errors.login = loginError

  const passwordError = await validatePassword(body.User.password, db, mode, item)
  if (passwordError) errors.password = passwordError

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody }
