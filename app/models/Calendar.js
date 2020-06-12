/** @format */
'use strict'

const moment = require('moment')

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

  Calendar.prototype.calculateStatus = async function () {
    const status = {
      ag: 'Aguardando',
      atd: 'Atrasado por dependência',
      at: 'Atrasado',
      ad: 'Em andamento',
      cc: 'Concluído!'
    }

    const ready = this.ready
    const now = moment()
    const startDate = moment(this.start)
    const endDate = this.end ? moment(this.end) : startDate

    //Aguardando
    if (now < startDate) return status['ag']

    //Atrasado por dependencia
    const fatherCalendar = this.calendar_id ? await sequelize.models.Calendar.findByPk(this.calendar_id) : null
    const fatherStatus = fatherCalendar ? await fatherCalendar.calculateStatus() : null
    if (fatherStatus === status['atd'] || fatherStatus === status['at']) return status['atd']

    //Atrasado
    if (ready === false && now > startDate) return status['at']

    //Em andamento
    if (ready === true && now > startDate && now < endDate) return status['ad']

    //Concluído
    return status['cc']
  }

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
