/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const Petition = sequelize.define(
    'Petition',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      petitionEvent_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      inscription_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  Petition.associate = function (models) {
    //Petition.belongsTo(models.PetitionEvent, { foreignKey: 'petitionEvent_id', targetKey: 'id' })
    //Petition.belongsTo(models.Inscription, { foreignKey: 'inscription_id', targetKey: 'id' })
    //Petition.hasOne(models.PetitionReply, { foreignKey: 'petition_id' })
  }

  Petition.beforeDestroy(async (petition, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições em modelos relacionados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Petition.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'petition',
      href: apiRoutes.find(r => r.key === 'petitionApiRoute').value + '/' + values.id
    }
    return values
  }

  return Petition
}
