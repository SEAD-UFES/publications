'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SelectiveProcesses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },

      /* course_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Courses',
          key: 'id'
        }
      }, */

      number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      description : {
        type: Sequelize.TEXT,
        allowNull: true
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SelectiveProcesses');
  }
};

