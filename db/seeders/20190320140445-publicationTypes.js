'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PublicationTypes', [
      { id: uuid(), name: "Lançamento/Retificação de Edital" },
      { id: uuid(), name: "Lançamento/Retificação de Calendário" },
      { id: uuid(), name: "Lançamento/Retificação de Resultados" },
      { id: uuid(), name: "Lançamento/Retificação de Resultados Pós-Recurso" },
      { id: uuid(), name: "Notificações" }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PublicationTypes', null, {});
  }
};

