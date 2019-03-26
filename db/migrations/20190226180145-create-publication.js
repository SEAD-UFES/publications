'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Publications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      }, 
      publicationType_id: {
        type: Sequelize.UUID,
        references: {
          model: 'PublicationTypes',
          key: 'id'
        }
      }, 
      selectiveProcess_id: {
        type: Sequelize.UUID,
        references: {
          model: 'SelectiveProcesses',
          key: 'id'
        },
        allowNull: false
      },
      call_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Calls',
          key: 'id'
        },
        allowNull: true
      },
      step_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Steps',
          key: 'id'
        },
        allowNull: true
      },
      description: {
        type: Sequelize.STRING
      },
      file: {
        type: Sequelize.STRING
      },
      valid: {
        type: Sequelize.BOOLEAN
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Publications');
  }
};
