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

        return queryInterface.bulkInsert('Permissions', [
          { id: uuid(), name: 'usuários listar', description: 'descrição', action_id: action_ids['GET'], target_id: target_ids['/v1/users'] },
          { id: uuid(), name: 'usuário criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/users'] },
          { id: uuid(), name: 'usuário editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/users/:id'] },
          { id: uuid(), name: 'usuário acessar', description: 'descrição', action_id: action_ids['GET'], target_id: target_ids['/v1/users/:id'] },
          { id: uuid(), name: 'chamada criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/calls']  },
          { id: uuid(), name: 'chamada acessar', description: 'descrição', action_id: action_ids['GET'], target_id: target_ids['/v1/calls/:id'] },
          { id: uuid(), name: 'chamada editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/calls/:id'] },
          { id: uuid(), name: 'chamada apagar', description: 'descrição', action_id: action_ids['DELETE'], target_id: target_ids['/v1/calls/:id'] },
          { id: uuid(), name: 'curso criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/courses'] },
          { id: uuid(), name: 'pessoa acessar', description: 'descrição', action_id: action_ids['GET'], target_id: target_ids['/v1/people/:id'] },
          { id: uuid(), name: 'pessoa editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/people/:id'] },
          { id: uuid(), name: 'etapa editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/steps'] },
          { id: uuid(), name: 'etapa criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/steps'] },
          { id: uuid(), name: 'vaga criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/vacancies'] },
          { id: uuid(), name: 'vaga editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/vacancies/:id'] },
          { id: uuid(), name: 'vaga acessar', description: 'descrição', action_id: action_ids['GET'], target_id: target_ids['/v1/vacancies/:id'] },
          { id: uuid(), name: 'processo seletivo criar', description: 'descrição', action_id: action_ids['POST'], target_id: target_ids['/v1/selectiveprocesses'] },
          { id: uuid(), name: 'processo seletivo editar', description: 'descrição', action_id: action_ids['PUT'], target_id: target_ids['/v1/selectiveprocesses/:id'] }
        ], {});

      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {});
  }
};
