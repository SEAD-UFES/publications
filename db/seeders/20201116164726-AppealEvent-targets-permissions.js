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
            id: uuidByString('appealevent-target-id-1'),
            name: 'appealevent api (general)',
            urn: '/v1/appealevents'
          },
          {
            id: uuidByString('appealevent-target-id-2'),
            name: 'appealevent api (specific)',
            urn: '/v1/appealevents/:id'
          }
        ],
        { transaction: t }
      )

      //insert appealevent permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('appealevent_create'),
            name: 'appealevent_create',
            description: 'Criar evento de recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('appealevent-target-id-1')
          },
          {
            id: uuidByString('appealevent_read'),
            name: 'appealevent_read',
            description: 'Ler evento de recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appealevent-target-id-2')
          },
          {
            id: uuidByString('appealevent_update'),
            name: 'appealevent_update',
            description: 'Atualizar evento de recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('appealevent-target-id-2')
          },
          {
            id: uuidByString('appealevent_delete'),
            name: 'appealevent_delete',
            description: 'Excluir evento de recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('appealevent-target-id-2')
          },
          {
            id: uuidByString('appealevent_list'),
            name: 'appealevent_list',
            description: 'Listar eventos de recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('appealevent-target-id-1')
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
      const targetIds = [uuidByString('appealevent-target-id-1'), uuidByString('appealevent-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('appealevent_create'),
        uuidByString('appealevent_read'),
        uuidByString('appealevent_update'),
        uuidByString('appealevent_delete'),
        uuidByString('appealevent_list')
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
