/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const AppealReply = sequelize.define(
    'AppealReply',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      appeal_id: {
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

  AppealReply.associate = function (models) {
    AppealReply.belongsTo(models.Appeal, { foreignKey: 'appeal_id', targetKey: 'id' })
  }

  AppealReply.beforeDestroy(async (appealReply, _) => {
    //validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    //sem restrições em modelos relacionados
    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar
  })

  AppealReply.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'appealReply',
      href: apiRoutes.find(r => r.key === 'appealReplyApiRoute').value + '/' + values.id
    }
    return values
  }

  return AppealReply
}
