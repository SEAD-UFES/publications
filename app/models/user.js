const uuid = require('uuid/v4');
'use strict';
const bcrypt = require('bcrypt');
const apiRoutes = require('../../config/apiRoutes.json');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    login: {
      type: DataTypes.STRING,
      validate: {
        len: [4, 20]
      },
      unique: true,
      allowNull: false
    },
    password: DataTypes.STRING,
    userType: {
      type: DataTypes.ENUM('ufes', 'sead'),
      validate: {
        isIn: [['ufes', 'sead']]
      }
    },
    authorized: DataTypes.BOOLEAN
  }, {
    paranoid:true
  });
  User.associate = function(models) {
    User.belongsToMany(models.RoleType, {
      through: 'Role',
      as:'roles',
      foreignKey: 'user_id'
    });

    return User;
  };

  User.beforeCreate((user, _ ) => {
    return bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash;
        user.id = uuid();
      })
      .catch(e => {
        throw new Error();
      });
  });

  User.prototype.validPassword = async function(password){
    return await bcrypt.compare(password, this.password);
  }

  User.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'user',
      href: apiRoutes.find(r => r.key === "userApiRoute").value + '/' + values.id
    };

    delete values.password;
    return values;
  }
  
  return User;
};

