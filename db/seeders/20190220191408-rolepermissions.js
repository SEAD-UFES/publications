"use strict";
const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let permission_ids = {};
    let roletype_ids = {};

    return queryInterface.sequelize.query(`SELECT id, name FROM RoleTypes`, { type: queryInterface.sequelize.QueryTypes.SELECT }).then(rolesTypes => {
      for (const el of rolesTypes) {
        roletype_ids[el.name] = el.id;
      }

      return queryInterface.sequelize.query(`SELECT id, name FROM Permissions`, { type: queryInterface.sequelize.QueryTypes.SELECT }).then(permissions => {
        for (const el of permissions) {
          permission_ids[el.name] = el.id;
        }

        return queryInterface.bulkInsert("RolePermissions", [
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["chamada acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["chamada apagar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["chamada criar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["chamada editar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["etapa criar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["etapa editar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["pessoa acessar"] },

          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["processo seletivo listar"] },
          
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["processo seletivo criar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["processo seletivo editar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["usuário acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["vaga acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["vaga criar"] },
          { id: uuid(), roleType_id: roletype_ids["Coordenador"], permission_id: permission_ids["vaga editar"] },

          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["chamada acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["chamada apagar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["chamada criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["chamada editar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["curso criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["etapa criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["etapa editar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["pessoa acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["pessoa editar"] },

          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["processo seletivo listar"] }, // 

          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["processo seletivo criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["processo seletivo editar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["usuário acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["usuário criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["usuário editar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["usuários listar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["vaga acessar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["vaga criar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["vaga editar"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["publication_create"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["publication_update"] },
          { id: uuid(), roleType_id: roletype_ids["Gerente"], permission_id: permission_ids["publication_delete"] }
        ]);
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("RolePermissions", null, {});
  }
};
