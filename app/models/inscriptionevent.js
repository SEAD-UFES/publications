/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')

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
