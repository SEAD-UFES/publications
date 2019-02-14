'use strict';
const uuid = require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    roleType_id: DataTypes.UUID,
    permission_id: DataTypes.UUID
  }, {});
  RolePermission.associate = function(models) {
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
  };
  RolePermission.beforeCreate((rolePermission, _ ) => {
    rolePermission.id = uuid();
    return rolePermission;
  });
  return RolePermission;
};