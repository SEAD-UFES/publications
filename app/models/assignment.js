/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    'Assignment',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    { timestamps: true }
  )
  Assignment.associate = function (models) {
    // associations can be defined here
  }

  Assignment.beforeCreate((assignment, _) => {
    assignment.id = uuid()
    return assignment
  })

  Assignment.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'assignment',
      href: apiRoutes.find(r => r.key === 'assignmentApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return Assignment
}
