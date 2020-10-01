/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/course')

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      graduationType_id: {
        type: DataTypes.UUID
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

  Course.associate = function (models) {
    Course.belongsTo(models.GraduationType, { foreignKey: 'graduationType_id' })
  }

  Course.beforeCreate((course, _) => {
    course.id = uuid()
    return course
  })

  Course.beforeDestroy(async (course, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(course, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Action', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Course.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'course',
      href: apiRoutes.find(r => r.key === 'courseApiRoute').value + '/' + values.id
    }

    return values
  }
  return Course
}
