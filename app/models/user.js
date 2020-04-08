/** @format */

'use strict'

const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../../app/validators/users')

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
    { timestamps: true, paranoid: true }
  )
  User.associate = function (models) {
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
    if (user._changed.password) {
      return bcrypt
        .hash(user.password, 10)
        .then(hash => (user.password = hash))
        .catch(e => {
          throw new Error()
        })
    } else {
      return user
    }
  })

  User.beforeDestroy(async (user, _) => {
    //validação de restrições neste ou em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(user, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'User', errors: errors }
    }

    //operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //vazio
  })

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  User.prototype.toJSON = function () {
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
