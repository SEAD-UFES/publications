/** @format */

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Calendars', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      call_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Calls',
          key: 'id'
        }
      },
      calendar_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Calendars',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ready: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Calendars')
  }
}
