'use strict';

const uuid = require('uuid/v4');
const models = require('../models');
const apiRoutes = require('../../config/apiRoutes.json');


module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    }

  }, {});

  City.associate = function(models) {
    City.belongsTo(models.State, {
      foreignKey: 'state_id', 
      sourceKey: 'id'
    })
    return City;
  };

  City.beforeCreate((city, _) => {
    return city.id = uuid()
  });  

  City.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'city',
      href: apiRoutes.find(r => r.key === "cityApiRoute").value + '/' + values.id
    };

    return values;
  };

  return City;
};
