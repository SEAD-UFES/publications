/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/action')

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define(
    'Action',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    },
    { timestamps: true, paranoid: true }
  )

  Action.associate = function (models) {
    // associations can be defined here
  }

  Target.beforeDestroy(async (action, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(action, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Action', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Action.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'action',
      href: apiRoutes.find(r => r.key === 'actionApiRoute').value + '/' + values.id
    }

    return values
  }
  return Action
}
