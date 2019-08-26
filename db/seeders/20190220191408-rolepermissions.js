'use strict'
const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let permission_ids = {}
    let roletype_ids = {}

    return queryInterface.sequelize
      .query(`SELECT id, name FROM RoleTypes`, { type: queryInterface.sequelize.QueryTypes.SELECT })
      .then(rolesTypes => {
        for (const el of rolesTypes) {
          roletype_ids[el.name] = el.id
        }

        return queryInterface.sequelize
          .query(`SELECT id, name FROM Permissions`, { type: queryInterface.sequelize.QueryTypes.SELECT })
          .then(permissions => {
            for (const el of permissions) {
              permission_ids[el.name] = el.id
            }

            return queryInterface.bulkInsert('RolePermissions', [
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['call_create'] },
              {
                id: uuid(),
                roleType_id: roletype_ids['Coordenador'],
                permission_id: permission_ids['call_read']
              },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['call_update'] },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['call_delete'] },

              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['step_create'] },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['step_update'] },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['people_read'] },

              {
                id: uuid(),
                roleType_id: roletype_ids['Coordenador'],
                permission_id: permission_ids['selectiveprocess_list']
              },

              {
                id: uuid(),
                roleType_id: roletype_ids['Coordenador'],
                permission_id: permission_ids['selectiveprocess_create']
              },
              {
                id: uuid(),
                roleType_id: roletype_ids['Coordenador'],
                permission_id: permission_ids['selectiveprocess_create']
              },
              {
                id: uuid(),
                roleType_id: roletype_ids['Coordenador'],
                permission_id: permission_ids['user_read']
              },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['vacancy_read'] },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['vacancy_create'] },
              { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['vacancy_update'] },

              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['call_read'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['call_delete'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['call_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['call_update'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['course_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['step_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['step_update'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['people_read'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['people_update'] },

              {
                id: uuid(),
                roleType_id: roletype_ids['Gerente'],
                permission_id: permission_ids['selectiveprocess_list']
              }, //

              {
                id: uuid(),
                roleType_id: roletype_ids['Gerente'],
                permission_id: permission_ids['selectiveprocess_create']
              },
              {
                id: uuid(),
                roleType_id: roletype_ids['Gerente'],
                permission_id: permission_ids['selectiveprocess_create']
              },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['user_read'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['user_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['user_update'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['user_list'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['vacancy_read'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['vacancy_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['vacancy_update'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['publication_create'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['publication_update'] },
              { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['publication_delete'] }
            ])
          })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RolePermissions', null, {})
  }
}
