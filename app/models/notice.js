'use strict'

const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define(
    'Notice',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      override: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  )

  Notice.associate = function(models) {
    // associations can be defined here
    Notice.belongsTo(models.SelectiveProcess, {
      sourceKey: 'id',
      foreignKey: 'selectiveProcess_id'
    })
  }

  Notice.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'notice',
      href: apiRoutes.find(r => r.key === 'noticeApiRoute').value + '/' + values.id
    }

    return values
  }

  return Notice
}
