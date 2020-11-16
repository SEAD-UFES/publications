/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const AppealEvent = sequelize.define(
    'AppealEvent',
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

  AppealEvent.associate = function (models) {
    AppealEvent.belongsTo(models.Calendar, { foreignKey: 'calendar_id', targetKey: 'id' })
    AppealEvent.belongsTo(models.InscriptionEvent, { foreignKey: 'inscriptionEvent_id', targetKey: 'id' })
    AppealEvent.hasMany(models.Appeal, { foreignKey: 'appealEvent_id' })
  }

  AppealEvent.beforeDestroy(async (appealEvent, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições em modelos relacionados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  AppealEvent.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'appealEvent',
      href: apiRoutes.find(r => r.key === 'appealEventApiRoute').value + '/' + values.id
    }
    return values
  }

  return AppealEvent
}
