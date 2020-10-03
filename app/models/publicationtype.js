/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/publicationtype')

module.exports = (sequelize, DataTypes) => {
  const PublicationType = sequelize.define(
    'PublicationType',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  PublicationType.beforeCreate((publicationType, _) => {
    return (publicationType.id = uuid())
  })

  PublicationType.beforeDestroy(async (publicationType, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(publicationType, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'PublicationType', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  PublicationType.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'publicationType',
      href: apiRoutes.find(r => r.key === 'publicationTypeApiRoute').value + '/' + values.id
    }

    return values
  }

  return PublicationType
}
