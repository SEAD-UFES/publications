/** @format */

const { isEmpty } = require('../helpers/is-empty')

const validateDelete = async (user, models) => {
  const errors = {}

  //validate UserRoles constraint
  const userRoles = await models.UserRole.findAll({
    where: { user_id: user.id }
  })
  if (userRoles.length > 0) {
    errors.id = 'Este usuário está associado a atribuições de papel ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
