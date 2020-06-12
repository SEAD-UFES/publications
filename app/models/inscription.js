/** @format */

'use strict'

const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/inscription')

module.exports = (sequelize, DataTypes) => {
  const Inscription = sequelize.define(
    'Inscription',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      inscriptionEvent_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      person_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      vacancy_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  Inscription.associate = function (models) {
    Inscription.belongsTo(models.InscriptionEvent, { foreignKey: 'inscriptionEvent_id', targetKey: 'id' })
  }

  Inscription.beforeValidate(async (inscription, _) => {
    //gerar numero de inscrição
    const maxQuery = await sequelize.models.Inscription.findAll({
      attributes: [[sequelize.fn('MAX', sequelize.col('number')), 'maxNumber']],
      paranoid: false,
      where: { inscriptionEvent_id: inscription.inscriptionEvent_id }
    })
    const maxNumber = maxQuery[0].dataValues.maxNumber
    inscription.number = maxNumber ? maxNumber + 1 : 1
  })

  Inscription.beforeDestroy(async (inscription, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(inscription, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Inscription', errors: errors }
    }

    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Inscription.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'inscription',
      href: apiRoutes.find(r => r.key === 'inscriptionApiRoute').value + '/' + values.id
    }
    return values
  }

  return Inscription
}
