/** @format */

'use strict'

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let graduationType_ids = {}

    return queryInterface.sequelize
      .query(`SELECT id, name FROM GraduationTypes`, { type: queryInterface.sequelize.QueryTypes.SELECT })
      .then(graduationTypes => {
        for (const el of graduationTypes) {
          graduationType_ids[el.name] = el.id
        }

        return queryInterface.bulkInsert(
          'Courses',
          [
            {
              id: uuid(),
              name: 'GPPGR',
              description: 'curso de Gestão de Políticas Públicas em Gênero e Raça - EAD',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Artes Visuais',
              description: 'curso de licenciatura em Artes Visuais - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Biologia',
              description: 'curso de licenciatura em Biologia - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Filosofia',
              description: 'curso de licenciatura em Filosofia - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Física',
              description: 'curso de licenciatura em Física - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em História',
              description: 'curso de licenciatura em História - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Pedagogia',
              description: 'curso de licenciatura em Pedagogia - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Licenciatura em Química',
              description: 'curso de licenciatura em Química - EAD',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Dimensões da Humanização',
              description: 'curso de aperfeiçoamento em Dimensões da Humanização - EAD',
              graduationType_id: graduationType_ids['Aperfeiçoamento']
            },
            {
              id: uuid(),
              name: 'Gestão em Saúde',
              description: 'curso de especialização Gestão em Saúde - EAD',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Prevenção do Uso de Drogas',
              description:
                'curso de aperfeiçoamento em Prevenção do Uso de Drogas para educadores de escolas públicas - EAD',
              graduationType_id: graduationType_ids['Aperfeiçoamento']
            },
            {
              id: uuid(),
              name: 'Direitos Humanos',
              description: 'curso de especialização em Direitos Humanos - EAD',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Especialização em Matemática',
              description: 'Curso de especialização em Ensino de Matemática - EAD',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Especialização Epidemiologia',
              description: 'curso de especialização em Epidemiologia - EAD',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Especialização em Educação',
              description: 'Especialização em educação, pobreza e desiqualdade',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Edu Pob e Desigualdade',
              description:
                'Curso de especialização em Educação, pobreza e desigualdade social, na modalidade a distância - SECADI/UFES',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Oratória Transversalidade e D.',
              description: 'Oratória, Transversalidade e Didática da Fala para Formação de Professores',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Filosofia e Psicanálise',
              description: 'Especialização Filosofia e Psicanálise',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Gestão Pública',
              description: 'Curso de especialização em Gestão Pública',
              graduationType_id: graduationType_ids['Especialização']
            },
            {
              id: uuid(),
              name: 'Licenciatura Letras Italiano',
              description: 'Licenciatura em Letras Italiano',
              graduationType_id: graduationType_ids['Graduação']
            },
            {
              id: uuid(),
              name: 'Especialização Ciencia e Dez',
              description: 'Especialização em ensino de ciências - anos finais do ensino fundamental - Ciência é 10!',
              graduationType_id: graduationType_ids['Especialização']
            }
          ],
          {}
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Courses', null, {})
  }
}
