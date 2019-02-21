'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Calls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      selectiveProcess_id: {
        type: Sequelize.UUID,
        references: {
          model: 'SelectiveProcesses',
          key: 'id'
        },
        allowNull: false
      },
      number: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      enrollmentOpeningDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      enrollmentClosingDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endingDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: { 
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Calls');
  }
};

