'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Actions', [
      { id: uuid(), name: 'GET',    description: 'Consulta instâncias na rota.'},
      { id: uuid(), name: 'POST',   description: 'Cria uma nova instância na rota.' }, 
      { id: uuid(), name: 'PUT',    description: 'Atualiza uma instância na rota.' }, 
      { id: uuid(), name: 'DELETE', description: 'Remove uma instância na rota.' }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Actions', null, {});
  }
};
