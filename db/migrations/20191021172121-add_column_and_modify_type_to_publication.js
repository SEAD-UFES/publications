'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Publications', 'title', {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'step_id'
      }),
      await queryInterface.changeColumn('Publications', 'description', {
        type: Sequelize.TEXT
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('Publications', 'title'),
      await queryInterface.changeColumn('Publications', 'description', {
        type: Sequelize.STRING
      })
    ]
  }
}
