/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/roletype')

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
        defaultValue: '',
        allowNull: true
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

  RoleType.beforeDestroy(async (roleType, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(roleType, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'RoleType', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

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
