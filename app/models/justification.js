/** @format */

'use strict'
module.exports = (sequelize, DataTypes) => {
  const Justification = sequelize.define(
    'Justification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      inscription_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    { timestamps: true, paranoid: true }
  )

  Justification.associate = function (models) {
    Justification.belongsTo(models.Inscription, { foreignKey: 'inscription_id', targetKey: 'id' })
  }

  return Justification
}
