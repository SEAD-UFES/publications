'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'RoleTypes',
      [
        { id: uuid(), name: 'Administrador', description: 'Administrador do Sistema.', global: true },
        { id: uuid(), name: 'Gerente', description: 'Pessoal da Administração da SEAD.', global: true },
        { id: uuid(), name: 'Coordenador', description: 'Coordena cursos e gerencia seus participantes.', global: false },
        { id: uuid(), name: 'Avaliador', description: 'Realiza avaliações dos participantes.', global: false },
        { id: uuid(), name: 'Publicador', description: 'Publica comunicados, editais e resultados.', global: false }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoleTypes', null, {})
  }
}

