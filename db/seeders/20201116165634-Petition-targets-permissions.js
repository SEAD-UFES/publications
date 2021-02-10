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
            id: uuidByString('petition-target-id-1'),
            name: 'petition api (general)',
            urn: '/v1/petitions'
          },
          {
            id: uuidByString('petition-target-id-2'),
            name: 'petition api (specific)',
            urn: '/v1/petitions/:id'
          }
        ],
        { transaction: t }
      )

      //insert petition permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('petition_create'),
            name: 'petition_create',
            description: 'Criar recurso.',
            action_id: actionIds['POST'],
            target_id: uuidByString('petition-target-id-1')
          },
          {
            id: uuidByString('petition_read'),
            name: 'petition_read',
            description: 'Ler recurso.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petition-target-id-2')
          },
          {
            id: uuidByString('petition_update'),
            name: 'petition_update',
            description: 'Atualizar recurso.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('petition-target-id-2')
          },
          {
            id: uuidByString('petition_delete'),
            name: 'petition_delete',
            description: 'Excluir recurso.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('petition-target-id-2')
          },
          {
            id: uuidByString('petition_list'),
            name: 'petition_list',
            description: 'Listar recursos.',
            action_id: actionIds['GET'],
            target_id: uuidByString('petition-target-id-1')
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
      const targetIds = [uuidByString('petition-target-id-1'), uuidByString('petition-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('petition_create'),
        uuidByString('petition_read'),
        uuidByString('petition_update'),
        uuidByString('petition_delete'),
        uuidByString('petition_list')
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
