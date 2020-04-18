/** @format */

'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Assignments',
      [
        {
          id: uuid(),
          name: 'Aluno',
          description: 'Estudante da instituição.'
        },
        {
          id: uuid(),
          name: 'Tutor Presencial',
          description: 'Responsável por contato direto e presencial com os alunos.'
        },
        {
          id: uuid(),
          name: 'Tutor a Distância',
          description: 'Responsável por avalição dos alunos e contato com os professores.'
        },
        {
          id: uuid(),
          name: 'Professor',
          description: 'Responsável por preparar as aulas e materiais para a plataforma.'
        },
        {
          id: uuid(),
          name: 'Estagiário',
          description: 'Efetua trabalho de aprendizado na instituição.'
        },
        {
          id: uuid(),
          name: 'Coordenador de Curso',
          description: 'Responsável pelo andamento do curso a distância.'
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Assignments', null, {})
  }
}
