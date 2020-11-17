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
            id: uuidByString('petitionevent-target-id-1'),
            name: 'petitionevent api (general)',
            urn: '/v1/petitionevents'
          },
          {
            id: uuidByString('petitionevent-target-id-2'),
            name: 'petitionevent api (specific)',
            urn: '/v1/petitionevents/:id'
          }
        ],
        { transaction: t }
      )

      //insert petitionevent permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('petitionevent_create'),
            name: 'petitionevent_create',
            description: 'Criar evento de recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('petitionevent-target-id-1')
          },
          {
            id: uuidByString('petitionevent_read'),
            name: 'petitionevent_read',
            description: 'Ler evento de recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petitionevent-target-id-2')
          },
          {
            id: uuidByString('petitionevent_update'),
            name: 'petitionevent_update',
            description: 'Atualizar evento de recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('petitionevent-target-id-2')
          },
          {
            id: uuidByString('petitionevent_delete'),
            name: 'petitionevent_delete',
            description: 'Excluir evento de recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('petitionevent-target-id-2')
          },
          {
            id: uuidByString('petitionevent_list'),
            name: 'petitionevent_list',
            description: 'Listar eventos de recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petitionevent-target-id-1')
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
      const targetIds = [uuidByString('petitionevent-target-id-1'), uuidByString('petitionevent-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('petitionevent_create'),
        uuidByString('petitionevent_read'),
        uuidByString('petitionevent_update'),
        uuidByString('petitionevent_delete'),
        uuidByString('petitionevent_list')
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
