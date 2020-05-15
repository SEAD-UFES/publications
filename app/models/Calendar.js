/** @format */
'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/calendar')

module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    'Calendar',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      call_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      calendar_id: {
        type: DataTypes.UUID,
        defaultValue: null,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ready: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      }
    },
    { timestamps: true, paranoid: true }
  )

  Calendar.associate = function (models) {
    Calendar.belongsTo(models.Call, { foreignKey: 'call_id', targetKey: 'id' })
    Calendar.belongsTo(models.Calendar, { foreignKey: 'calendar_id', targetKey: 'id' })
  }

  Calendar.beforeDestroy(async (calendar, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(calendar, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Calendar', errors: errors }
    }

    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Calendar.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'calendar',
      href: apiRoutes.find(r => r.key === 'calendarApiRoute').value + '/' + values.id
    }
    return values
  }

  return Calendar
}
