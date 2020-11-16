/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AppealReplies', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      appeal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Appeals',
          key: 'id'
        }
      },
      accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      justification: {
        type: Sequelize.TEXT,
        allowNull: false
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
    return queryInterface.dropTable('AppealReplies')
  }
}
