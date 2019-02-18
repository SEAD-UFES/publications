'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Targets', [
      { id: uuid(), name: 'user api (general)', urn:'/v1/users' },
      { id: uuid(), name: 'user api (specific)', urn:'/v1/users/:id' }, 
      { id: uuid(), name: 'selective process api', urn:'/v1/selectiveprocesses' },
      { id: uuid(), name: 'call api (general)', urn:'/v1/calls' },
      { id: uuid(), name: 'call api (specific)', urn:'/v1/calls/:id' },
      { id: uuid(), name: 'course api (general)', urn:'/v1/courses' },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Targets', null, {});
  }
};
