/** @format */

'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Targets',
      [
        { id: uuid(), name: 'user api (general)', urn: '/v1/users' },
        { id: uuid(), name: 'user api (specific)', urn: '/v1/users/:id' },

        { id: uuid(), name: 'person api (specific)', urn: '/v1/people/:id' },

        { id: uuid(), name: 'course api (general)', urn: '/v1/courses' },

        { id: uuid(), name: 'selective process api (general)', urn: '/v1/selectiveprocesses' },
        { id: uuid(), name: 'selective process api (specific)', urn: '/v1/selectiveprocesses/:id' },

        { id: uuid(), name: 'call api (general)', urn: '/v1/calls' },
        { id: uuid(), name: 'call api (specific)', urn: '/v1/calls/:id' },

        { id: uuid(), name: 'step api (general)', urn: '/v1/steps' },
        { id: uuid(), name: 'step api (specific)', urn: '/v1/steps/:id' },

        { id: uuid(), name: 'vacancy api (general)', urn: '/v1/vacancies' },
        { id: uuid(), name: 'vacancy api (specific)', urn: '/v1/vacancies/:id' }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Targets', null, {})
  }
}
