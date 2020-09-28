/** @format */

'use strict'

const { isUUID } = require('validator')
const { isValidBool } = require('../helpers/validatorHelpers')
const { isEmpty } = require('../helpers/is-empty.js')

const validateId = value => {
  //value must be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }
}

const validateName = async (value, db, mode, item) => {
  //Mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value must be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }

  //value must be unique / only one "administrador"
  if (typeof value !== 'undefined') {
    const whereIgnoreOwnId = mode === 'update' ? { id: { [db.Sequelize.Op.not]: item.id } } : {}
    const numDuplicates = await db.RoleType.count({ where: { name: value, ...whereIgnoreOwnId } })
    if (numDuplicates > 0) {
      return 'O nome deve único.'
    }
  }

  //no errors
  return null
}

const validateDescription = (value, mode) => {
  //Mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value must be valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Valor inválido.'
  }
}

const validateGlobal = value => {
  //value must be boolean
  if (typeof value !== 'undefined' && !isValidBool(value)) {
    return 'Valor inválido.'
  }

  //no errors
  return null
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  const idError = await validateId(body.id)
  if (idError) errors.id = idError

  const nameError = await validateName(body.name, db, mode, item)
  if (nameError) errors.name = nameError

  const descriptionError = validateDescription(body.description, mode)
  if (descriptionError) errors.description = descriptionError

  const globalError = validateGlobal(body.global)
  if (globalError) errors.global = globalError

  return !isEmpty(errors) ? errors : null
}

const validateDelete = async (roleType, models) => {
  const errors = {}

  //Não pode ser deletado se for "Administrador".
  if (roleType.name === 'Administrador') {
    errors.name = 'Não é possivel apagar o papel Administrador'
  }

  //Não pode ser deletado se estiver sendo usado por um UserRole
  const userRoles = await models.UserRole.count({ where: { roleType_id: roleType.id } })
  if (userRoles > 0) {
    errors.id = 'Este Papel é dependência de Atribuições de Papel ativas.'
  }

  //Não pode ser deletado se estiver sendo usado por um RolePermission
  const rolePermissions = await models.RolePermission.count({ where: { roleType_id: roleType.id } })
  if (rolePermissions > 0) {
    errors.id = 'Este Papel é dependência de Atribuições de Permissão ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateBody, validateDelete }
