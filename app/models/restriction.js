/** @format */

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
;('use strict')
module.exports = (sequelize, DataTypes) => {
  const Restriction = sequelize.define(
    'Restriction',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  )
  Restriction.associate = function(models) {
    // associations can be defined here
  }

  Restriction.beforeCreate((restriction, _) => {
    restriction.id = uuid()
    return restriction
  })

  Restriction.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'restriction',
      href: apiRoutes.find(r => r.key === 'restrictionApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }
  return Restriction
}
