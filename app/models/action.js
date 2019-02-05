const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Action.associate = function(models) {
    // associations can be defined here
  };

  Action.beforeCreate((action, _) => {
    action.id = uuid();
    return action;
  });

  Action.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'action',
      href: apiRoutes.find(r => r.key === "actionApiRoute").value + '/' + values.id
    };

    return values;
  }
  return Action;
};