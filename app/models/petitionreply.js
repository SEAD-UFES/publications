/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const PetitionReply = sequelize.define(
    'PetitionReply',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      petition_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  PetitionReply.associate = function (models) {
    PetitionReply.belongsTo(models.Petition, { foreignKey: 'petition_id', targetKey: 'id' })
  }

  PetitionReply.beforeDestroy(async (petitionReply, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições em modelos relacionados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  PetitionReply.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'petitionReply',
      href: apiRoutes.find(r => r.key === 'petitionReplyApiRoute').value + '/' + values.id
    }
    return values
  }

  return PetitionReply
}
