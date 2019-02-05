const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Target = sequelize.define('Target', {
    name: DataTypes.STRING,
    urn: DataTypes.STRING
  }, {});
  Target.associate = function(models) {
    // associations can be defined here
  };

  Target.beforeCreate((target, _) => {
    target.id = uuid();
    return target;
  });

  Target.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'target',
      href: apiRoutes.find(r => r.key === "targetApiRoute").value + '/' + values.id
    };

    return values;
  }

  return Target;
};