/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Publication = sequelize.define(
    'Publication',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      selectiveProcess_id: {
        type: DataTypes.UUID
      },
      call_id: {
        type: DataTypes.UUID
      },
      step_id: {
        type: DataTypes.UUID
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      file: {
        type: DataTypes.STRING
      },
      valid: {
        type: DataTypes.BOOLEAN
      },
      date: {
        type: DataTypes.DATE
      }
    },
    { timestamps: true, paranoid: true }
  )

  Publication.associate = function (models) {
    Publication.belongsTo(models.SelectiveProcess, { foreignKey: 'selectiveProcess_id' })
    Publication.belongsTo(models.PublicationType, { foreignKey: 'publicationType_id' })
    Publication.belongsTo(models.Call, { foreignKey: 'call_id' })
    Publication.belongsTo(models.Step, { foreignKey: 'step_id' })
  }

  Publication.beforeCreate((publication, _) => {
    publication.id = uuid()
    return publication
  })

  Publication.beforeDestroy(async (publication, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições de deleção.
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Publication.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'publication',
      href: apiRoutes.find(r => r.key === 'publicationApiRoute').value + '/' + values.id
    }

    return values
  }

  return Publication
}
