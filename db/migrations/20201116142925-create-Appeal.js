/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Appeals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      appealEvent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'AppealEvents',
          key: 'id'
        }
      },
      inscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Inscriptions',
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descriptiopn: {
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
    return queryInterface.dropTable('Appeals')
  }
}
