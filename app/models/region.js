/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/region')

module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    'Region',
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

  Region.associate = function (models) {
    Region.hasMany(models.Vacancy, { foreignKey: 'region_id' })
  }

  Region.beforeCreate((region, _) => {
    region.id = uuid()
    return region
  })

  Region.beforeDestroy(async (region, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(region, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Region', errors: errors }
    }
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Region.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'region',
      href: apiRoutes.find(r => r.key === 'regionApiRoute').value + '/' + values.id
    }

    return values
  }

  return Region
}
