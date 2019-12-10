/** @format */

'use strict'

//const uuid = require('uuid/v4')

const randomToken = require('crypto-random-string')

module.exports = (sequelize, DataTypes) => {
  const UserVerificationToken = sequelize.define(
    'UserVerificationToken',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      token: DataTypes.STRING
    },
    {}
  )
  UserVerificationToken.associate = function(models) {
    UserVerificationToken.belongsTo(models.User, { foreignKey: 'user_id' })
  }

  UserVerificationToken.beforeCreate((userVerification, _) => {
    return (userVerification.token = randomToken(52) + '0' + Date.now().toString(16))
  })

  return UserVerificationToken
}
