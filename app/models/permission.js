const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    target_id: DataTypes.UUID,
    action_id: DataTypes.UUID
  }, {});
  Permission.associate = function(models) {
    Permission.hasOne(models.Target, { foreignKey: 'target_id' });
    Permission.hasOne(models.Action, { foreignKey: 'action_id' });
    return Permission;
  };

  Permission.beforeCreate((permission, _) => {
    permission.id = uuid();
    return permission;
  });

  Permission.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'permission',
      href: apiRoutes.find(r => r.key === "permissionApiRoute").value + '/' + values.id
    };

    return values;
  }
  return Permission;
};