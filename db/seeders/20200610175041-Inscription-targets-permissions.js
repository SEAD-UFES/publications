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
            id: uuidByString('inscription-target-id-1'),
            name: 'inscription api (general)',
            urn: '/v1/inscriptions'
          },
          {
            id: uuidByString('inscription-target-id-2'),
            name: 'inscription api (specific)',
            urn: '/v1/inscriptions/:id'
          }
        ],
        { transaction: t }
      )

      //insert Inscription permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('inscription_create'),
            name: 'inscription_create',
            description: 'Criar inscrição.',
            action_id: actionIds['POST'],
            target_id: uuidByString('inscription-target-id-1')
          },
          {
            id: uuidByString('inscription_read'),
            name: 'inscription_read',
            description: 'Ler inscrição.',
            action_id: actionIds['GET'],
            target_id: uuidByString('inscription-target-id-2')
          },
          {
            id: uuidByString('inscription_update'),
            name: 'inscription_update',
            description: 'Atualizar inscrição.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('inscription-target-id-2')
          },
          {
            id: uuidByString('inscription_delete'),
            name: 'inscription_delete',
            description: 'Excluir inscrição.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('inscription-target-id-2')
          },
          {
            id: uuidByString('inscription_list'),
            name: 'inscription_list',
            description: 'Listar inscrições.',
            action_id: actionIds['GET'],
            target_id: uuidByString('inscription-target-id-1')
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
      const targetIds = [uuidByString('inscription-target-id-1'), uuidByString('inscription-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('inscription_create'),
        uuidByString('inscription_read'),
        uuidByString('inscription_update'),
        uuidByString('inscription_delete'),
        uuidByString('inscription_list')
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
