/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/permission')

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      target_id: {
        type: DataTypes.UUID
      },
      action_id: {
        type: DataTypes.UUID
      }
    },
    { timestamps: true, paranoid: true }
  )

  Permission.associate = function (models) {
    Permission.belongsTo(models.Target, { foreignKey: 'target_id' })
    Permission.belongsTo(models.Action, { foreignKey: 'action_id' })
    Permission.belongsToMany(models.RoleType, { through: models.RolePermission, foreignKey: 'permission_id' })
  }

  Permission.beforeDestroy(async (permission, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(permission, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Permission', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Permission.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'permission',
      href: apiRoutes.find(r => r.key === 'permissionApiRoute').value + '/' + values.id
    }

    return values
  }
  return Permission
}
