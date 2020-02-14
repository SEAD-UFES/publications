/** @format */

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('InscriptionEvents', 'call_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Calls',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('InscriptionEvents', 'call_id')
  }
}
