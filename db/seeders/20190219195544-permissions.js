'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {

    let target_ids = {};
    let action_ids = {};

    return queryInterface.sequelize.query(
      `SELECT id, name FROM Actions`, {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    ).then(actions => {
      for (const el of actions) {
        action_ids[el.name] = el.id;
      }

      return queryInterface.sequelize.query(
        `SELECT id, urn FROM Targets`, {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      ).then(targets => {
        for (const el of targets) {
          target_ids[el.urn] = el.id;
        }

        return queryInterface.bulkInsert('Permissions', [{
            id: uuid(),
            name: 'Listar usuários.',
            description: 'descrição',
            action_id: action_ids['GET'],
            target_id: target_ids['/v1/users']
          },
          {
            id: uuid(),
            name: 'Criar usuário.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/users']
          },
          {
            id: uuid(),
            name: 'Editar usuário.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/users/:id']
          },
          {
            id: uuid(),
            name: 'Acessar usuário.',
            description: 'descrição',
            action_id: action_ids['GET'],
            target_id: target_ids['/v1/users/:id']
          },

          {
            id: uuid(),
            name: 'Criar chamada.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/calls']
          },
          {
            id: uuid(),
            name: 'Acessar chamada.',
            description: 'descrição',
            action_id: action_ids['GET'],
            target_id: target_ids['/v1/calls/:id']
          },
          {
            id: uuid(),
            name: 'Editar chamada.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/calls/:id']
          },
          {
            id: uuid(),
            name: 'Apagar chamada.',
            description: 'descrição',
            action_id: action_ids['DELETE'],
            target_id: target_ids['/v1/calls/:id']
          },

          {
            id: uuid(),
            name: 'Criar curso.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/courses']
          },

          {
            id: uuid(),
            name: 'Acessar pessoa.',
            description: 'descrição',
            action_id: action_ids['GET'],
            target_id: target_ids['/v1/people/:id']
          },
          {
            id: uuid(),
            name: 'Editar pessoa.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/people/:id']
          },

          {
            id: uuid(),
            name: 'Editar etapa.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/steps']
          },
          {
            id: uuid(),
            name: 'Criar etapa.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/steps']
          },

          {
            id: uuid(),
            name: 'Criar vaga.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/vacancies']
          },
          {
            id: uuid(),
            name: 'Editar vaga.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/vacancies/:id']
          },
          {
            id: uuid(),
            name: 'Acessar vaga.',
            description: 'descrição',
            action_id: action_ids['GET'],
            target_id: target_ids['/v1/vacancies/:id']
          },

          {
            id: uuid(),
            name: 'Criar processo seletivo.',
            description: 'descrição',
            action_id: action_ids['POST'],
            target_id: target_ids['/v1/selectiveprocesses']
          },
          {
            id: uuid(),
            name: 'Editar processo seletivo.',
            description: 'descrição',
            action_id: action_ids['PUT'],
            target_id: target_ids['/v1/selectiveprocesses/:id']
          }

        ], {});

      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {});
  }
};
