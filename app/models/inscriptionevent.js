/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/inscriptionevents')

module.exports = (sequelize, DataTypes) => {
  const InscriptionEvent = sequelize.define(
    'InscriptionEvent',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      calendar_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      numberOfInscriptionsAllowed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      allowMultipleAssignments: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      allowMultipleRegions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      allowMultipleRestrictions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  InscriptionEvent.associate = function (models) {
    InscriptionEvent.belongsTo(models.Calendar, { foreignKey: 'calendar_id', targetKey: 'id' })
  }

  InscriptionEvent.beforeDestroy(async (inscriptionEvent, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(inscriptionEvent, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Calendar', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  InscriptionEvent.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    values.link = {
      rel: 'inscriptionEvent',
      href: apiRoutes.find(r => r.key === 'inscriptionEventApiRoute').value + '/' + values.id
    }

    return values
  }

  return InscriptionEvent
}
