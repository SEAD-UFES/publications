/** @format */

'use strict'

const uuid = require('uuid/v4')
const models = require('../models')
const apiRoutes = require('../../config/apiRoutes.json')

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
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      }
    },
    {}
  )

  GraduationType.associate = function(models) {
    GraduationType.hasMany(models.Course, { foreignKey: 'graduationType_id' })

    return GraduationType
  }

  GraduationType.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'graduationType',
      href: apiRoutes.find(r => r.key === 'graduationTypeApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return GraduationType
}
