/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Inscriptions',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false
        },
        inscriptionEvent_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'InscriptionEvents',
            key: 'id'
          }
        },
        person_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'People',
            key: 'id'
          }
        },
        vacancy_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Vacancies',
            key: 'id'
          }
        },
        number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
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
        },
        isActive: {
          type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL'
        }
      },
      {
        uniqueKeys: {
          unique_inscriptionevent_person_vacancy_isActive: {
            fields: ['inscriptionEvent_id', 'person_id', 'vacancy_id', 'isActive'],
            customIndex: true
          }
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Inscriptions')
  }
}
