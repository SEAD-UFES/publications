/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const InscriptionEvent = sequelize.define(
    'InscriptionEvent',
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      numberOfInscriptionsAllowed: DataTypes.INTEGER,
      oneInscriptionPerAssignment: DataTypes.BOOLEAN,
      oneInscriptionPerRegion: DataTypes.BOOLEAN,
      oneInscriptionPerRestriction: DataTypes.BOOLEAN
    },
    {}
  )
  InscriptionEvent.associate = function(models) {
    // associations can be defined here
  }

  InscriptionEvent.beforeCreate((inscriptionEvent, _) => {
    inscriptionEvent.id = uuid()
    return inscriptionEvent
  })

  InscriptionEvent.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'inscriptionEvent',
      href: apiRoutes.find(r => r.key === 'inscriptionEventApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return InscriptionEvent
}
