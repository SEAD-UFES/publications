/** @format */

'use strict'

const { isAdmin, hasGlobalPermission } = require('../helpers/permissionCheck')
const { checkIsMyPerson } = require('../helpers/personHelpers')

const validatePermissionRead = async (person, user) => {
  //Im Admin. So, I have permission.
  if (isAdmin(user)) return null

  //I have global permisson. So, I have permission.
  const permission = 'people_read'
  if (hasGlobalPermission(user, permission)) return null

  //This person belongs to my user. So, I have permission.
  const isMyPerson = checkIsMyPerson(person, user)
  if (isMyPerson) return null

  //if no permission
  return { message: 'O usuário não tem permissão para acessar esse recurso.' }
}

const validateDelete = async (person, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma inscription
  const inscriptions = await models.Inscription.count({ where: { person_id: person.id } })
  if (inscriptions > 0) {
    errors.id = 'Esta Pessoa é dependência de Inscrições ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validatePermissionRead, validateDelete }
