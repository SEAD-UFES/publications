/** @format */

'use strict'

const uuid = require('uuid/v4')
const models = require('../models')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      description: DataTypes.STRING
    },
    {}
  )
  Course.associate = function(models) {
    Course.belongsTo(models.GraduationType, { foreignKey: 'graduationType_id' })

    return Course
  }

  Course.beforeCreate((course, _) => {
    course.id = uuid()
    return course
  })

  Course.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'course',
      href: apiRoutes.find(r => r.key === 'courseApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }
  return Course
}
