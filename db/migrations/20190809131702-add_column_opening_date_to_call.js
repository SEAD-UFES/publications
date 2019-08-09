/** @format */

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Calls', 'openingDate', {
      type: Sequelize.DATE,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Calls', 'openingDate')
  }
}
