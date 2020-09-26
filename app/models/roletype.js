/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const RoleType = sequelize.define(
    'RoleType',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      global: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  RoleType.associate = function (models) {
    RoleType.hasMany(models.UserRole, { foreignKey: 'roleType_id' })
    RoleType.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: 'roleType_id' })
  }

  RoleType.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'roleType',
      href: apiRoutes.find(r => r.key === 'roleTypeApiRoute').value + '/' + values.id
    }

    return values
  }

  return RoleType
}
