/** @format */

const validateDelete = async (target, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Permission
  const permissions = await models.Permission.count({ where: { target_id: target.id } })
  if (permissions > 0) {
    errors.id = 'Este Target é dependência de Permissões ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
