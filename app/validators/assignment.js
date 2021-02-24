/** @format */

const { isEmpty } = require('../helpers/is-empty.js')

const validateName = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //value is unique
  if (typeof value !== 'undefined') {
    const haveOnDB = await db.Assignment.count({ where: { name: value } })
    if (haveOnDB) return 'Já existe uma atribuição com este nome.'
  }

  //no errors
  return null
}

const validateDescription = (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //tamanho mínimo
  if (typeof value !== 'undefined' && (typeof value !== 'string' || value.length < 5 || value.length >= 255)) {
    return 'A Descrição precisa ter entre 5 e 256 caracteres.'
  }

  //no errors
  return null
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const nameError = await validateName(body.name, db, mode, item)
  if (nameError) errors.name = nameError

  const descriptionError = validateDescription(body.description, db, mode, item)
  if (descriptionError) errors.description = descriptionError

  return !isEmpty(errors) ? errors : null
}

const validateDelete = async (assignment, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Vacancy
  const vacancies = await models.Vacancy.count({ where: { assignment_id: assignment.id } })
  if (vacancies > 0) {
    errors.id = 'Este Cargo é dependência de Ofertas de Vaga ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validateDelete }
