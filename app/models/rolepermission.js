/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      roleType_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  RolePermission.associate = function (models) {
    RolePermission.belongsTo(models.RoleType, { foreignKey: 'roleType_id' })
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' })
  }

  RolePermission.beforeDestroy(async (rolePermission, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //Sem retrições para verificar.
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  RolePermission.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'rolePermission',
      href: apiRoutes.find(r => r.key === 'rolePermissionApiRoute').value + '/' + values.id
    }

    return values
  }

  return RolePermission
}
