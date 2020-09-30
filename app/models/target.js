/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/target')

module.exports = (sequelize, DataTypes) => {
  const Target = sequelize.define(
    'Target',
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
      urn: {
        type: DataTypes.STRING
      }
    },
    { timestamps: true, paranoid: true }
  )

  Target.associate = function (models) {
    // associations can be defined here
  }

  Target.beforeDestroy(async (target, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(target, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Target', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Target.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'target',
      href: apiRoutes.find(r => r.key === 'targetApiRoute').value + '/' + values.id
    }

    return values
  }

  return Target
}
