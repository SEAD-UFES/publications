'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('States', [
      { id: uuid(), name: 'Acre', abbreviation: 'AC' },
      { id: uuid(), name: 'Alagoas', abbreviation: 'AL' },
      { id: uuid(), name: 'Amapá', abbreviation: 'AP' },
      { id: uuid(), name: 'Amazonas', abbreviation: 'AM' },
      { id: uuid(), name: 'Bahia', abbreviation: 'BA' },
      { id: uuid(), name: 'Ceará', abbreviation: 'CE' },
      { id: uuid(), name: 'Distrito Federal', abbreviation: 'DF' },
      { id: uuid(), name: 'Espírito Santo', abbreviation: 'ES' },
      { id: uuid(), name: 'Goiás', abbreviation: 'GO' },
      { id: uuid(), name: 'Maranhão', abbreviation: 'MA' },
      { id: uuid(), name: 'Mato Grosso', abbreviation: 'MT' },
      { id: uuid(), name: 'Mato Grosso do Sul', abbreviation: 'MS' },
      { id: uuid(), name: 'Minas Gerais', abbreviation: 'MG' },
      { id: uuid(), name: 'Pará', abbreviation: 'PA' },
      { id: uuid(), name: 'Paraíba', abbreviation: 'PB' },
      { id: uuid(), name: 'Paraná', abbreviation: 'PR' },
      { id: uuid(), name: 'Pernambuco', abbreviation: 'PE' },
      { id: uuid(), name: 'Piauí', abbreviation: 'PI' },
      { id: uuid(), name: 'Rio de Janeiro', abbreviation: 'RJ' },
      { id: uuid(), name: 'Rio Grande do Norte', abbreviation: 'RN' },
      { id: uuid(), name: 'Rio Grande do Sul', abbreviation: 'RS' },
      { id: uuid(), name: 'Rondônia', abbreviation: 'RO' },
      { id: uuid(), name: 'Roraima', abbreviation: 'RR' },
      { id: uuid(), name: 'Santa Catarina', abbreviation: 'SC' },
      { id: uuid(), name: 'São Paulo', abbreviation: 'SP' },
      { id: uuid(), name: 'Sergipe', abbreviation: 'SE' },
      { id: uuid(), name: 'Tocantins', abbreviation: 'TO' }     
    ], {});
  },

  down: (queryInterface, Sequelize) => { 
    return queryInterface.bulkDelete('States', null, {});
  }
};

