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
            id: uuidByString('inscriptionevent-target-id-1'),
            name: 'inscriptionEvent api (general)',
            urn: '/v1/inscriptionevents'
          },
          {
            id: uuidByString('inscriptionevent-target-id-2'),
            name: 'inscriptionEvent api (specific)',
            urn: '/v1/inscriptionevents/:id'
          }
        ],
        { transaction: t }
      )

      //insert InscriptionEvent permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('inscriptionevent_create'),
            name: 'inscriptionevent_create',
            description: 'Criar evento de inscrição.',
            action_id: actionIds['POST'],
            target_id: uuidByString('inscriptionevent-target-id-1')
          },
          {
            id: uuidByString('inscriptionevent_read'),
            name: 'inscriptionevent_read',
            description: 'Ler evento de inscrição.',
            action_id: actionIds['GET'],
            target_id: uuidByString('inscriptionevent-target-id-2')
          },
          {
            id: uuidByString('inscriptionevent_update'),
            name: 'inscriptionevent_update',
            description: 'Atualizar evento de inscrição.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('inscriptionevent-target-id-2')
          },
          {
            id: uuidByString('inscriptionevent_delete'),
            name: 'inscriptionevent_delete',
            description: 'Excluir evento de inscrição.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('inscriptionevent-target-id-2')
          },
          {
            id: uuidByString('inscriptionevent_list'),
            name: 'inscriptionevent_list',
            description: 'Listar eventos de inscrição.',
            action_id: actionIds['GET'],
            target_id: uuidByString('inscriptionevent-target-id-1')
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
      const targetIds = [uuidByString('inscriptionevent-target-id-1'), uuidByString('inscriptionevent-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('inscriptionevent_create'),
        uuidByString('inscriptionevent_read'),
        uuidByString('inscriptionevent_update'),
        uuidByString('inscriptionevent_delete'),
        uuidByString('inscriptionevent_list')
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
