/** @format */

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
;('use strict')
module.exports = (sequelize, DataTypes) => {
  const StepType = sequelize.define(
    'StepType',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  )
  StepType.associate = function(models) {
    // associations can be defined here
  }

  StepType.beforeCreate((stepType, _) => {
    stepType.id = uuid()
    return stepType
  })

  StepType.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    values.link = {
      rel: 'stepType',
      href: apiRoutes.find(r => r.key === 'stepTypeApiRoute').value + '/' + values.id
    }

    delete values.createdAt
    delete values.updatedAt

    return values
  }
  return StepType
}
