const uuid = require('uuid/v4');
'use strict';

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    roleType_id: DataTypes.UUID,
    permission_id: DataTypes.UUID
  }, {});
  RolePermission.associate = function(models) {
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
    RolePermission.belongsTo(models.RoleType, { foreignKey: 'roleType_id' });

    return RolePermission;
  };
  RolePermission.beforeCreate((rolePermission, _ ) => {
    rolePermission.id = uuid();

    return rolePermission;
  });
  return RolePermission;
};
