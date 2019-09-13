/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      roleType_id: DataTypes.UUID,
      permission_id: DataTypes.UUID
    },
    {}
  )

  RolePermission.associate = function(models) {
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' })
    RolePermission.belongsTo(models.RoleType, { foreignKey: 'roleType_id' })

    return RolePermission
  }

  RolePermission.beforeCreate((rolePermission, _) => {
    rolePermission.id = uuid()

    return rolePermission
  })

  RolePermission.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'rolePermission',
      href: apiRoutes.find(r => r.key === 'rolePermissionApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return RolePermission
}
