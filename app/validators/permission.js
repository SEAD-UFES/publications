/** @format */

const validateDelete = async (roleType, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por um RolePermission
  const rolePermissions = await models.RolePermission.count({ where: { roleType_id: roleType.id } })
  if (rolePermissions > 0) {
    errors.id = 'Esta permissão é dependência de Atribuições de Permissão ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
