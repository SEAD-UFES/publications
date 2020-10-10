/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/assignment')

module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    'Assignment',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    },
    { timestamps: true, paranoid: true }
  )

  Assignment.associate = function (models) {
    Assignment.hasMany(models.Vacancy, { foreignKey: 'assignment_id' })
  }

  Assignment.beforeCreate((assignment, _) => {
    assignment.id = uuid()
    return assignment
  })

  Assignment.beforeDestroy(async (assignment, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(assignment, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Assignment', errors: errors }
    }
    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Assignment.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'assignment',
      href: apiRoutes.find(r => r.key === 'assignmentApiRoute').value + '/' + values.id
    }

    return values
  }

  return Assignment
}
