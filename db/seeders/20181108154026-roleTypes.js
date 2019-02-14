'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RoleTypes', [
      { id: uuid(), name: 'Administrador', description: 'Administrador do Sistema.'},
      { id: uuid(), name: 'Gerente',       description: 'Pessoal da Administração da SEAD.' }, 
      { id: uuid(), name: 'Coordenador',   description: 'Coordena cursos e gerencia seus participantes.' }, 
      { id: uuid(), name: 'Avaliador',     description: 'Realiza avaliações dos participantes.' }, 
      { id: uuid(), name: 'Publicador',    description: 'Publica comunicados, editais e resultados.' }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoleTypes', null, {});
  }
};

