/** @format */

'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Regions',
      [
        {
          id: uuid(),
          name: 'Afonso Cláudio',
          description: 'Polo presencial de Afonso Cláudio.'
        },
        {
          id: uuid(),
          name: 'Alegre',
          description: 'Polo presencial de Alegre.'
        },
        {
          id: uuid(),
          name: 'Aracruz',
          description: 'Polo presencial de Aracruz.'
        },
        {
          id: uuid(),
          name: 'Baixo Guandu',
          description: 'Polo presencial de Baixo Guandu.'
        },
        {
          id: uuid(),
          name: 'Bom Jesus do Norte',
          description: 'Polo presencial de Bom Jesus do Norte.'
        },
        {
          id: uuid(),
          name: 'Cachoeiro de Itapemirim',
          description: 'Polo presencial de Cachoeiro de Itapemirim.'
        },
        {
          id: uuid(),
          name: 'Cariacica',
          description: 'Polo presencial de Cariacica.'
        },
        {
          id: uuid(),
          name: 'Castelo',
          description: 'Polo presencial de Castelo.'
        },
        {
          id: uuid(),
          name: 'Colatina',
          description: 'Polo presencial de Colatina.'
        },
        {
          id: uuid(),
          name: 'Conceição da Barra',
          description: 'Polo presencial de Conceição da Barra.'
        },
        {
          id: uuid(),
          name: 'Domingos Martins',
          description: 'Polo presencial de Domingos Martins.'
        },
        {
          id: uuid(),
          name: 'Ecoporanga',
          description: 'Polo presencial de Ecoporanga.'
        },
        {
          id: uuid(),
          name: 'Fundão',
          description: 'Polo presencial de Fundão.'
        },
        {
          id: uuid(),
          name: 'Guarapari',
          description: 'Polo presencial de Guarapari.'
        },
        {
          id: uuid(),
          name: 'Itapemirim',
          description: 'Polo presencial de Itapemirim.'
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Regions', null, {})
  }
}
