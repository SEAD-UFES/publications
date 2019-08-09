/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('SelectiveProcesses', 'course_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('SelectiveProcesses', 'course_id')
  }
}
