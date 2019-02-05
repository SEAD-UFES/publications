const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    roleType_id: DataTypes.UUID,
    user_id: DataTypes.UUID
  }, {});
  Role.associate = function(models) {
    Role.belongsTo(models.User, { foreignKey: 'user_id'});
    Role.belongsTo(models.RoleType, { foreignKey: 'roleType_id' });
    return Role;
  };
  Role.beforeCreate((role, _ ) => {
    role.id = uuid();
    return role;
  });
  return Role;
};