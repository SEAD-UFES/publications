'use strict'

const uuid = require('uuid/v4')
const models = require('../models')
const apiRoutes = require('../../config/apiRoutes.json')

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
        allowNull: true
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)')
      }
    },
    {
      paranoid: true
    }
  )

  SelectiveProcess.associate = function(models) {
    SelectiveProcess.hasMany(models.Call, { foreignKey: 'selectiveProcess_id' })
    SelectiveProcess.hasMany(models.Publication, { foreignKey: 'selectiveProcess_id' })
    SelectiveProcess.hasMany(models.Notice, { foreignKey: 'selectiveProcess_id' })
    SelectiveProcess.belongsTo(models.Course, { foreignKey: 'course_id' })

    return SelectiveProcess
  }

  SelectiveProcess.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'selectiveProcess',
      href: apiRoutes.find(r => r.key === 'selectiveProcessApiRoute').value + '/' + values.id
    }

    return values
  }

  return SelectiveProcess
}
