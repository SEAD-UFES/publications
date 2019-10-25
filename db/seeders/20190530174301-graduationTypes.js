/** @format */

'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'GraduationTypes',
      [
        { id: uuid(), name: 'Ensino Médio' },
        { id: uuid(), name: 'Ensino Técnico' },
        { id: uuid(), name: 'Graduação' },
        { id: uuid(), name: 'Aperfeiçoamento' },
        { id: uuid(), name: 'Especialização' },
        { id: uuid(), name: 'Mestrado' },
        { id: uuid(), name: 'Doutorado' },
        { id: uuid(), name: ' N/A ' }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('GraduationTypes', null, {})
  }
}
