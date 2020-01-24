/** @format */

'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InscriptionEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      numberOfInscriptionsAllowed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      oneInscriptionPerAssignment: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      oneInscriptionPerRegion: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      oneInscriptionPerRestriction: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('InscriptionEvents')
  }
}
