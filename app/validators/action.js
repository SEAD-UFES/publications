/** @format */

const validateDelete = async (action, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Permission
  const permissions = await models.Permission.count({ where: { action_id: action.id } })
  if (permissions > 0) {
    errors.id = 'Esta Action é dependência de Permissões ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
