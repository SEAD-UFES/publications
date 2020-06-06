/** @format */

'use strict'
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
        allowNull: false
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

  Inscription.beforeCreate(async (inscription, _) => {
    //Gerar numero de inscrição.
  })

  Inscription.beforeUpdate(async (inscription, _) => {
    //Proibir atualização do numero de inscrição.
  })

  Inscription.beforeDestroy(async (inscription, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    // sem restrições de modelos associados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Inscription.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'calendar',
      href: apiRoutes.find(r => r.key === 'inscriptionApiRoute').value + '/' + values.id
    }
    return values
  }

  return Inscription
}
