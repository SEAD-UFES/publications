'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Calls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      selectiveProcess_id: {
        type: Sequelize.UUID,
        references: {
          model: 'SelectiveProcesses',
          key: 'id'
        }
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
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
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
