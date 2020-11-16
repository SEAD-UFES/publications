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
            id: uuidByString('appeal-target-id-1'),
            name: 'appeal api (general)',
            urn: '/v1/appeals'
          },
          {
            id: uuidByString('appeal-target-id-2'),
            name: 'appeal api (specific)',
            urn: '/v1/appeals/:id'
          }
        ],
        { transaction: t }
      )

      //insert appeal permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('appeal_create'),
            name: 'appeal_create',
            description: 'Criar recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('appeal-target-id-1')
          },
          {
            id: uuidByString('appeal_read'),
            name: 'appeal_read',
            description: 'Ler recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appeal-target-id-2')
          },
          {
            id: uuidByString('appeal_update'),
            name: 'appeal_update',
            description: 'Atualizar recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('appeal-target-id-2')
          },
          {
            id: uuidByString('appeal_delete'),
            name: 'appeal_delete',
            description: 'Excluir recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('appeal-target-id-2')
          },
          {
            id: uuidByString('appeal_list'),
            name: 'appeal_list',
            description: 'Listar recursos.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appeal-target-id-1')
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
      const targetIds = [uuidByString('appeal-target-id-1'), uuidByString('appeal-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('appeal_create'),
        uuidByString('appeal_read'),
        uuidByString('appeal_update'),
        uuidByString('appeal_delete'),
        uuidByString('appeal_list')
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
