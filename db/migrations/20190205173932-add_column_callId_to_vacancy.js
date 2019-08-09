/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Vacancies', 'call_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Calls',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Vacancies', 'call_id')
  }
}
