/** @format */

'use strict'

const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')
const apiRoutes = require('../../config/apiRoutes.json')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      login: {
        type: DataTypes.STRING,
        validate: {
          len: [4, 80]
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
      authorized: DataTypes.BOOLEAN,
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      paranoid: true
    }
  )
  User.associate = function(models) {
    User.hasMany(models.UserRole, { foreignKey: 'user_id' })
    User.hasOne(models.Person, { foreignKey: 'user_id' })

    return User
  }

  User.beforeCreate((user, _) => {
    return bcrypt
      .hash(user.password, 10)
      .then(hash => {
        user.password = hash
        user.id = uuid()
      })
      .catch(e => {
        throw new Error()
      })
  })

  User.beforeUpdate((user, _) => {
    return bcrypt
      .hash(user.password, 10)
      .then(hash => (user.password = hash))
      .catch(e => {
        throw new Error()
      })
  })

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
  }

  User.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'user',
      href: apiRoutes.find(r => r.key === 'userApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt
    delete values.deletedAt

    delete values.password

    return values
  }

  return User
}
