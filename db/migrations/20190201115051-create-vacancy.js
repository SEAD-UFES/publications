'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Vacancies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      qtd: {
        type: Sequelize.INTEGER
      },
      reserve: {
        type: Sequelize.BOOLEAN
      },
      assignment_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Assignments',
          key: 'id'
        }
      },
      restriction_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Restrictions',
          key: 'id'
        }
      },
      /*branch_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Branches',
          key: 'id'
        }
      },*/
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
    return queryInterface.dropTable('Vacancies');
  }
};