/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const Appeal = sequelize.define(
    'Appeal',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      appealEvent_id: {
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

  Appeal.associate = function (models) {
    Appeal.belongsTo(models.AppealEvent, { foreignKey: 'appealEvent_id', targetKey: 'id' })
    Appeal.belongsTo(models.Inscription, { foreignKey: 'inscription_id', targetKey: 'id' })
    Appeal.hasOne(models.AppealReply, { foreignKey: 'appeal_id' })
  }

  Appeal.beforeDestroy(async (appeal, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições em modelos relacionados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  Appeal.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'appeal',
      href: apiRoutes.find(r => r.key === 'appealApiRoute').value + '/' + values.id
    }
    return values
  }

  return Appeal
}
