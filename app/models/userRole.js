/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      }
    },
    {}
  )
  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id' })
    UserRole.belongsTo(models.RoleType, { foreignKey: 'roleType_id' })
    UserRole.belongsTo(models.Course, { foreignKey: 'course_id' })
    return UserRole
  }
  UserRole.beforeCreate((userRole, _) => {
    userRole.id = uuid()
    return userRole
  })

  UserRole.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'userRole',
      href: apiRoutes.find(r => r.key === 'userRoleApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return UserRole
}
