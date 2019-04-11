const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  }, {});
  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id'});
    UserRole.belongsTo(models.RoleType, { foreignKey: 'roleType_id' });
    UserRole.belongsTo(models.Course, { foreignKey: 'course_id' });
    return UserRole;
  };
  UserRole.beforeCreate((userRole, _ ) => {
    userRole.id = uuid();
    return userRole;
  });
  return UserRole;
};
