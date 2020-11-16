/** @format */

'use strict'

const uuidByString = require('uuid-by-string')

const { createActionIdsByName } = require('../helpers/actionHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //query actions from db.
      const actionIds = await createActionIdsByName(queryInterface)

      //insert targets
      await queryInterface.bulkInsert(
        'Targets',
        [
          {
            id: uuidByString('appealreply-target-id-1'),
            name: 'appealreply api (general)',
            urn: '/v1/appealreplies'
          },
          {
            id: uuidByString('appealreply-target-id-2'),
            name: 'appealreply api (specific)',
            urn: '/v1/appealreplies/:id'
          }
        ],
        { transaction: t }
      )

      //insert appealreply permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('appealreply_create'),
            name: 'appealreply_create',
            description: 'Criar resposta a recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('appealreply-target-id-1')
          },
          {
            id: uuidByString('appealreply_read'),
            name: 'appealreply_read',
            description: 'Ler resposta a recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appealreply-target-id-2')
          },
          {
            id: uuidByString('appealreply_update'),
            name: 'appealreply_update',
            description: 'Atualizar resposta a recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('appealreply-target-id-2')
          },
          {
            id: uuidByString('appealreply_delete'),
            name: 'appealreply_delete',
            description: 'Excluir resposta a recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('appealreply-target-id-2')
          },
          {
            id: uuidByString('appealreply_list'),
            name: 'appealreply_list',
            description: 'Listar respostas a recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appealreply-target-id-1')
          }
        ],
        { transaction: t }
      )

      //commit transaction
      await t.commit()

      //if error
    } catch (err) {
      console.log('Erro em up: ', err)
      await t.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //get Op
      const Op = Sequelize.Op

      //generate target ids to delete
      const targetIds = [uuidByString('appealreply-target-id-1'), uuidByString('appealreply-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('appealreply_create'),
        uuidByString('appealreply_read'),
        uuidByString('appealreply_update'),
        uuidByString('appealreply_delete'),
        uuidByString('appealreply_list')
      ]

      //delete permissions
      await queryInterface.bulkDelete('Permissions', { id: { [Op.in]: permissionIds } }, { transaction: t })

      //delete targets
      await queryInterface.bulkDelete('Targets', { id: { [Op.in]: targetIds } }, { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (err) {
      console.log('Erro em down: ', err)
      await t.rollback()
      throw err
    }
  }
}
