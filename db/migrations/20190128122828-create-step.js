'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Steps', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      stepType_id: {
        type: Sequelize.UUID,
        references: {
          model: 'StepTypes',
          key: 'id'
        }
      },
      call_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Calls',
          key: 'id'
        }
      },
      resultDate: {
        type: Sequelize.DATE
      },
      openAppealDate: {
        type: Sequelize.DATE
      },
      limitAppealDate: {
        type: Sequelize.DATE
      },
      resultAfterAppealDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Steps');
  }
};