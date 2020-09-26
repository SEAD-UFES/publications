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

module.exports = { validatePermissionRead }
