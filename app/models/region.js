const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Region.associate = function(models) {
    // associations can be defined here
  };
  Region.beforeCreate((region, _) => {
    region.id = uuid();
    return region;
  });
  Region.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'region',
      href: apiRoutes.find(r => r.key === "regionApiRoute").value + '/' + values.id
    };

    return values;
  }

  return Region;
};