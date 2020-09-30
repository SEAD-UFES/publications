/** @format */

const validateDelete = async (permission, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por um RolePermission
  const rolePermissions = await models.RolePermission.count({ where: { permission_id: permission.id } })
  if (rolePermissions > 0) {
    errors.id = 'Esta permissão é dependência de Atribuições de Permissão ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
