/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Call = sequelize.define(
    'Call',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      number: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      enrollmentOpeningDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      enrollmentClosingDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      openingDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endingDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  )

  Call.associate = function(models) {
    Call.belongsTo(models.SelectiveProcess, {
      sourceKey: 'id',
      foreignKey: 'selectiveProcess_id'
    })
    Call.hasMany(models.Step, { foreignKey: 'call_id' })
    Call.hasMany(models.Vacancy, { foreignKey: 'call_id' })
    Call.hasMany(models.Publication, { foreignKey: 'call_id' })
  }

  Call.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'call',
      href: apiRoutes.find(r => r.key === 'callApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt
    delete values.deletedAt

    return values
  }

  return Call
}
