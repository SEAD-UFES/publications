'use strict'
module.exports = (sequelize, DataTypes) => {
  const PasswordRecover = sequelize.define(
    'PasswordRecover',
    {
      token: DataTypes.STRING
    },
    {}
  )
  PasswordRecover.associate = function(models) {
    Call.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return PasswordRecover
}
