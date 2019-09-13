/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const RoleType = sequelize.define(
    'RoleType',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      global: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  )
  RoleType.associate = function(models) {
    RoleType.hasMany(models.UserRole, {
      foreignKey: 'roleType_id'
    })

    RoleType.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: 'roleType_id' })

    return RoleType
  }

  RoleType.beforeCreate((roleType, _) => {
    roleType.id = uuid()
    return roleType
  })

  RoleType.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'roleType',
      href: apiRoutes.find(r => r.key === 'roleTypeApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return RoleType
}
