/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/graduationtype')

module.exports = (sequelize, DataTypes) => {
  const GraduationType = sequelize.define(
    'GraduationType',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  GraduationType.associate = function (models) {
    GraduationType.hasMany(models.Course, { foreignKey: 'graduationType_id' })
  }

  GraduationType.beforeDestroy(async (graduationType, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(graduationType, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'GraduationType', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  GraduationType.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'graduationType',
      href: apiRoutes.find(r => r.key === 'graduationTypeApiRoute').value + '/' + values.id
    }

    return values
  }

  return GraduationType
}
