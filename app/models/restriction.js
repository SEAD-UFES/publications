/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Restriction = sequelize.define(
    'Restriction',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
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

  Restriction.associate = function (models) {
    Restriction.hasMany(models.Vacancy, { foreignKey: 'restriction_id' })
  }

  Restriction.beforeCreate((restriction, _) => {
    restriction.id = uuid()
    return restriction
  })

  Restriction.beforeDestroy(async (restriction, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(restriction, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Restriction', errors: errors }
    }
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Restriction.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'restriction',
      href: apiRoutes.find(r => r.key === 'restrictionApiRoute').value + '/' + values.id
    }

    return values
  }
  return Restriction
}
