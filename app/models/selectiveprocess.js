/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/selectiveprocess')

module.exports = (sequelize, DataTypes) => {
  const SelectiveProcess = sequelize.define(
    'SelectiveProcess',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  SelectiveProcess.associate = function (models) {
    SelectiveProcess.hasMany(models.Call, { foreignKey: 'selectiveProcess_id' })
    SelectiveProcess.hasMany(models.Publication, { foreignKey: 'selectiveProcess_id' })
    SelectiveProcess.belongsTo(models.Course, { foreignKey: 'course_id' })
  }

  SelectiveProcess.beforeDestroy(async (selectiveProcess, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(selectiveProcess, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Action', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  SelectiveProcess.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'selectiveProcess',
      href: apiRoutes.find(r => r.key === 'selectiveProcessApiRoute').value + '/' + values.id
    }

    return values
  }

  return SelectiveProcess
}
