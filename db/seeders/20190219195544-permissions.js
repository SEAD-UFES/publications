/** @format */

'use strict'
const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let target_ids = {}
    let action_ids = {}

    return queryInterface.sequelize
      .query(`SELECT id, name FROM Actions`, {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      .then(actions => {
        for (const el of actions) {
          action_ids[el.name] = el.id
        }

        return queryInterface.sequelize
          .query(`SELECT id, urn FROM Targets`, {
            type: queryInterface.sequelize.QueryTypes.SELECT
          })
          .then(targets => {
            for (const el of targets) {
              target_ids[el.urn] = el.id
            }

            return queryInterface.bulkInsert(
              'Permissions',
              [
                //user
                {
                  id: uuid(),
                  name: 'user_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/users']
                },
                {
                  id: uuid(),
                  name: 'user_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/users/:id']
                },
                {
                  id: uuid(),
                  name: 'user_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/users/:id']
                },
                {
                  id: uuid(),
                  name: 'user_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/users/:id']
                },
                {
                  id: uuid(),
                  name: 'user_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/users']
                },
                //call
                {
                  id: uuid(),
                  name: 'call_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/calls']
                },
                {
                  id: uuid(),
                  name: 'call_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/calls/:id']
                },
                {
                  id: uuid(),
                  name: 'call_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/calls/:id']
                },
                {
                  id: uuid(),
                  name: 'call_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/calls/:id']
                },
                {
                  id: uuid(),
                  name: 'call_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/calls']
                },
                //people
                {
                  id: uuid(),
                  name: 'people_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/people']
                },
                {
                  id: uuid(),
                  name: 'people_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/people/:id']
                },
                {
                  id: uuid(),
                  name: 'people_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/people/:id']
                },
                {
                  id: uuid(),
                  name: 'people_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/people/:id']
                },
                {
                  id: uuid(),
                  name: 'people_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/people']
                },
                //step
                {
                  id: uuid(),
                  name: 'step_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/steps']
                },
                {
                  id: uuid(),
                  name: 'step_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/courses/:id']
                },
                {
                  id: uuid(),
                  name: 'step_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/steps/:id']
                },
                {
                  id: uuid(),
                  name: 'step_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/courses/:id']
                },
                {
                  id: uuid(),
                  name: 'step_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/steps']
                },
                //vacancy
                {
                  id: uuid(),
                  name: 'vacancy_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/vacancies']
                },
                {
                  id: uuid(),
                  name: 'vacancy_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/vacancies/:id']
                },
                {
                  id: uuid(),
                  name: 'vacancy_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/vacancies/:id']
                },
                {
                  id: uuid(),
                  name: 'vacancy_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/vacancies/:id']
                },
                {
                  id: uuid(),
                  name: 'vacancy_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/vacancies']
                },
                //selectiveprocess
                {
                  id: uuid(),
                  name: 'selectiveprocess_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/selectiveprocesses']
                },
                {
                  id: uuid(),
                  name: 'selectiveprocess_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/selectiveprocesses:id']
                },
                {
                  id: uuid(),
                  name: 'selectiveprocess_update',
                  description: 'descrição',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/selectiveprocesses/:id']
                },
                {
                  id: uuid(),
                  name: 'selectiveprocess_delete',
                  description: 'descrição',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/selectiveprocesses/:id']
                },
                {
                  id: uuid(),
                  name: 'selectiveprocess_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/selectiveprocesses']
                },
                //publication
                {
                  id: uuid(),
                  name: 'publication_create',
                  description: 'Criar publicação',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/publications']
                },
                {
                  id: uuid(),
                  name: 'publication_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/publications/:id']
                },
                {
                  id: uuid(),
                  name: 'publication_update',
                  description: 'Editar publicação',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/publications/:id']
                },
                {
                  id: uuid(),
                  name: 'publication_delete',
                  description: 'Excluir publicação',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/publications/:id']
                },
                {
                  id: uuid(),
                  name: 'publication_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/publications']
                },
                //parameter
                {
                  id: uuid(),
                  name: 'parameter_list',
                  description: 'Listar parâmetros',
                  action_id: null,
                  target_id: null
                },
                //course
                {
                  id: uuid(),
                  name: 'course_create',
                  description: 'descrição',
                  action_id: action_ids['POST'],
                  target_id: target_ids['/v1/courses']
                },
                {
                  id: uuid(),
                  name: 'course_read',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/courses/:id']
                },
                {
                  id: uuid(),
                  name: 'course_update',
                  description: 'Editar curso',
                  action_id: action_ids['PUT'],
                  target_id: target_ids['/v1/courses/:id']
                },
                {
                  id: uuid(),
                  name: 'course_delete',
                  description: 'Excluir curso',
                  action_id: action_ids['DELETE'],
                  target_id: target_ids['/v1/courses/:id']
                },
                {
                  id: uuid(),
                  name: 'course_list',
                  description: 'descrição',
                  action_id: action_ids['GET'],
                  target_id: target_ids['/v1/courses']
                }
              ],
              {}
            )
          })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {})
  }
}
