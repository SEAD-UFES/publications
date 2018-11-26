'use strict';

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const apiRoutes = require('../../config/apiRoutes.json');

module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING(2),
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    }
  }, {});


  State.associate = function(models) {
    State.hasMany(models.City, {
      sourceKey: 'id',
      foreignKey: 'state_id'
    });
    return State;
  };

  State.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'state',
      href: apiRoutes.find(r => r.key === "stateApiRoute").value + '/' + values.id
    };

    return values;
  }

  return State;
};
