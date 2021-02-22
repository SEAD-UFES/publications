/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateOperationDelete } = require('../validators/petitionevent')

module.exports = (sequelize, DataTypes) => {
  const PetitionEvent = sequelize.define(
    'PetitionEvent',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      calendar_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      inscriptionEvent_id: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  PetitionEvent.associate = function (models) {
    //PetitionEvent.belongsTo(models.Calendar, { foreignKey: 'calendar_id', targetKey: 'id' })
    //PetitionEvent.belongsTo(models.InscriptionEvent, { foreignKey: 'inscriptionEvent_id', targetKey: 'id' })
    PetitionEvent.hasMany(models.Petition, { foreignKey: 'petitionEvent_id' })
  }

  PetitionEvent.beforeDestroy(async (petitionEvent, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateOperationDelete(petitionEvent, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'PetitionEvent', errors: errors }
    }

    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  PetitionEvent.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'petitionEvent',
      href: apiRoutes.find(r => r.key === 'petitionEventApiRoute').value + '/' + values.id
    }

    return values
  }

  return PetitionEvent
}
