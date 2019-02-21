'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {

    let permission_ids = {};
    let roletype_ids = {};

    return queryInterface.sequelize.query(
      `SELECT id, name FROM RoleTypes`, { type: queryInterface.sequelize.QueryTypes.SELECT}
    ).then(rolesTypes => {
      for (const el of rolesTypes) {
        roletype_ids[el.name] = el.id;
      }

      return queryInterface.sequelize.query(
        `SELECT id, name FROM Permissions`, { type: queryInterface.sequelize.QueryTypes.SELECT}
      ).then(permissions => {
        for (const el of permissions) {
          permission_ids[el.name] = el.id;
        }

        return queryInterface.bulkInsert('RolePermissions', [
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Apagar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar processo seletivo.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar vaga.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar etapa.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar pessoa.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Editar usuário.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar curso.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar usuário.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar vaga.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar etapa.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Criar processo seletivo.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Acessar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Acessar pessoa.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Acessar usuário.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Acessar vaga.'] },
          { id: uuid(), roleType_id: roletype_ids['Gerente'], permission_id: permission_ids['Listar usuários.'] },

          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Apagar chamada.'] }, 
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Editar processo seletivo.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Editar vaga.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Editar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Editar etapa.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Criar vaga.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Criar etapa.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Criar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Criar processo seletivo.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Acessar chamada.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Acessar pessoa.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Acessar usuário.'] },
          { id: uuid(), roleType_id: roletype_ids['Coordenador'], permission_id: permission_ids['Acessar vaga.'] },

        ]);

      })
    }) 
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('RolePermissions', null, {});
  }
};
