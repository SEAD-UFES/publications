/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AppealEvents', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      calendar_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Calendars',
          key: 'id'
        }
      },
      inscriptionEvent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'InscriptionEvents',
          key: 'id'
        }
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
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AppealEvents')
  }
}
