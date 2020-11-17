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
            id: uuidByString('petitionreply-target-id-1'),
            name: 'petitionreply api (general)',
            urn: '/v1/petitionreplies'
          },
          {
            id: uuidByString('petitionreply-target-id-2'),
            name: 'petitionreply api (specific)',
            urn: '/v1/petitionreplies/:id'
          }
        ],
        { transaction: t }
      )

      //insert petitionreply permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('petitionreply_create'),
            name: 'petitionreply_create',
            description: 'Criar resposta a recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('petitionreply-target-id-1')
          },
          {
            id: uuidByString('petitionreply_read'),
            name: 'petitionreply_read',
            description: 'Ler resposta a recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petitionreply-target-id-2')
          },
          {
            id: uuidByString('petitionreply_update'),
            name: 'petitionreply_update',
            description: 'Atualizar resposta a recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('petitionreply-target-id-2')
          },
          {
            id: uuidByString('petitionreply_delete'),
            name: 'petitionreply_delete',
            description: 'Excluir resposta a recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('petitionreply-target-id-2')
          },
          {
            id: uuidByString('petitionreply_list'),
            name: 'petitionreply_list',
            description: 'Listar respostas a recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petitionreply-target-id-1')
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
      const targetIds = [uuidByString('petitionreply-target-id-1'), uuidByString('petitionreply-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('petitionreply_create'),
        uuidByString('petitionreply_read'),
        uuidByString('petitionreply_update'),
        uuidByString('petitionreply_delete'),
        uuidByString('petitionreply_list')
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
