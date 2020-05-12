/** @format */
'use strict'

const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    'Calendar',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      call_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      calendar_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ready: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    { timestamps: true, paranoid: true }
  )

  Calendar.associate = function (models) {
    Calendar.belongsTo(models.Call, { foreignKey: 'call_id', targetKey: 'id' })
    Calendar.belongsTo(models.Calendar, { foreignKey: 'calendar_id', targetKey: 'id' })
  }

  Calendar.beforeDestroy((calendar, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições para conferir
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Calendar.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())
    values.link = {
      rel: 'calendar',
      href: apiRoutes.find(r => r.key === 'calendarApiRoute').value + '/' + values.id
    }
    return values
  }

  return Calendar
}
