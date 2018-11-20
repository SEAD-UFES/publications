const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoleType = sequelize.define('RoleType', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  RoleType.associate = function(models) {
    RoleType.belongsToMany(models.User, {
      through: 'Role',
      as:'roles',
      foreignKey: 'roleType_id'
    });

    return RoleType;
  };
  RoleType.beforeCreate((roleType, _ ) => {
    roleType.id = uuid();
    return roleType;
  });
  return RoleType;
};