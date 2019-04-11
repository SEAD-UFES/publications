'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    let user_ids = {};
    let role_ids = {};

    return queryInterface.sequelize.query(
      `SELECT id, login FROM Users`, { type: queryInterface.sequelize.QueryTypes.SELECT}
    ).then(users => {
      for (const el of users) {
        user_ids[el.login] = el.id;
      }

      return queryInterface.sequelize.query(
        `SELECT id, name FROM RoleTypes`, { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).then(roles => {
        for (const el of roles) {
          role_ids[el.name] = el.id;
        }

        return queryInterface.bulkInsert('UserRoles', [
          { id: uuid(), roleType_id: role_ids['Administrador'], user_id: user_ids['admin@ufes.br'] },
          { id: uuid(), roleType_id: role_ids['Coordenador'], user_id: user_ids['coordenador@ufes.br'] },
          { id: uuid(), roleType_id: role_ids['Gerente'], user_id: user_ids['gerente@ufes.br'] }
        ]);
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserRoles', null, {});
  }
};
