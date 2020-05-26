/** @format */

'use strict'

const jwt = require('jsonwebtoken')

const findUserByToken = async (token, jwt_secret, db) => {
  //check if have token
  if (token === null || typeof token === 'undefined') return null

  //test if token is valid
  let decoded
  try {
    decoded = jwt.verify(token, jwt_secret)
  } catch (e) {
    return null
  }

  //set user structure
  const userInclude = {
    include: [
      {
        model: db.UserRole,
        required: false,
        include: [
          { model: db.RoleType, required: false, include: [{ model: db.Permission, required: false }] },
          { model: db.Course, required: false }
        ]
      },
      {
        model: db.Person,
        require: false
      }
    ]
  }

  //get and return user
  const user = await db.User.findByPk(decoded.data, userInclude)
  if (user) return user
  else return null
}

module.exports = { findUserByToken }
