/** @format */

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
;('use strict')
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    'Region',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    { timestamps: true }
  )

  Region.associate = function (models) {
    Region.hasMany(models.Vacancy, { foreignKey: 'region_id' })
  }

  Region.beforeCreate((region, _) => {
    region.id = uuid()
    return region
  })

  Region.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'region',
      href: apiRoutes.find(r => r.key === 'regionApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }

  return Region
}
