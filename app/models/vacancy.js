/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/vacancy')

module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define(
    'Vacancy',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      qtd: {
        type: DataTypes.INTEGER
      },
      reserve: {
        type: DataTypes.BOOLEAN
      }
    },
    { timestamps: true, paranoid: true }
  )

  Vacancy.associate = function (models) {
    Vacancy.belongsTo(models.Call, { targetKey: 'id', foreignKey: 'call_id' })
    Vacancy.belongsTo(models.Assignment, {
      sourceKey: 'id',
      foreignKey: 'assignment_id'
    })
    Vacancy.belongsTo(models.Region, { targetKey: 'id', foreignKey: 'region_id' })
    Vacancy.belongsTo(models.Restriction, {
      sourceKey: 'id',
      foreignKey: 'restriction_id'
    })
  }

  Vacancy.beforeCreate((vacancy, _) => {
    vacancy.id = uuid()
    return vacancy
  })

  Vacancy.beforeDestroy(async (vacancy, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(vacancy, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Vacancy', errors: errors }
    }
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Vacancy.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'vacancy',
      href: apiRoutes.find(r => r.key === 'vacancyApiRoute').value + '/' + values.id
    }

    return values
  }
  return Vacancy
}
