/** @format */

'use strict'

//Retirei pois estava em beforeCreate
// const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const PasswordRecover = sequelize.define(
    'PasswordRecover',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: DataTypes.STRING
      }
    },
    { timestamps: true, paranoid: true }
  )

  PasswordRecover.associate = function (models) {
    PasswordRecover.belongsTo(models.User, { foreignKey: 'user_id' })
  }

  //Retirei porque (teoricamente) defaultValue: DataTypes.UUIDV4 cria o valor.
  // PasswordRecover.beforeCreate((passwordRecover, _) => {
  //   passwordRecover.id = uuid()
  //   return passwordRecover
  // })

  User.beforeDestroy(async (user, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //vazio
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //vazio
  })

  return PasswordRecover
}
