/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PetitionReplies', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      petition_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Petitions',
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
        defaultValue: null,
        allowNull: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PetitionReplies')
  }
}
