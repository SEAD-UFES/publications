'use strict'

const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const PasswordRecover = sequelize.define(
    'PasswordRecover',
    {
      token: DataTypes.STRING
    },
    {
      paranoid: true
    }
  )

  PasswordRecover.associate = function(models) {
    PasswordRecover.belongsTo(models.User, { foreignKey: 'user_id' })
  }

  PasswordRecover.beforeCreate((passwordRecover, _) => {
    passwordRecover.id = uuid()
    return passwordRecover
  })

  return PasswordRecover
}
