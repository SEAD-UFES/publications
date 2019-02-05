'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    roleType_id: DataTypes.UUID,
    permission_id: DataTypes.UUID
  }, {});
  RolePermission.associate = function(models) {
    // associations can be defined here
  };
  return RolePermission;
};