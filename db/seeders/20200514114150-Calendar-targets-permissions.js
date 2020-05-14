/** @format */

'use strict'

const uuidByString = require('uuid-by-string')

const createActionIdsByName = async queryInterface => {
  const actionLines = await queryInterface.sequelize.query(`SELECT id, name FROM Actions`, {
    type: queryInterface.sequelize.QueryTypes.SELECT
  })

  let idsByName = {}
  for (const el of actionLines) idsByName[el.name] = el.id

  return idsByName
}

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
          { id: uuidByString('calendar-target-id-1'), name: 'calendar api (general)', urn: '/v1/calendars' },
          { id: uuidByString('calendar-target-id-2'), name: 'calendar api (specific)', urn: '/v1/calendars/:id' }
        ],
        { transaction: t }
      )

      //insert calendar permissions
      await queryInterface.bulkInsert(
        'Permissions',
        [
          {
            id: uuidByString('calendar_create'),
            name: 'calendar_create',
            description: 'Criar item de calendário.',
            action_id: actionIds['POST'],
            target_id: uuidByString('calendar-target-id-1')
          },
          {
            id: uuidByString('calendar_read'),
            name: 'calendar_read',
            description: 'Ler item de calendário.',
            action_id: actionIds['GET'],
            target_id: uuidByString('calendar-target-id-2')
          },
          {
            id: uuidByString('calendar_update'),
            name: 'calendar_update',
            description: 'Atualizar item de calendário.',
            action_id: actionIds['PUT'],
            target_id: uuidByString('calendar-target-id-2')
          },
          {
            id: uuidByString('calendar_delete'),
            name: 'calendar_delete',
            description: 'Excluir item de calendário.',
            action_id: actionIds['DELETE'],
            target_id: uuidByString('calendar-target-id-2')
          },
          {
            id: uuidByString('calendar_list'),
            name: 'calendar_list',
            description: 'Listar itens de calendário.',
            action_id: actionIds['GET'],
            target_id: uuidByString('calendar-target-id-1')
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
      const targetIds = [uuidByString('calendar-target-id-1'), uuidByString('calendar-target-id-2')]

      //generate permission ids to delete
      const permissionIds = [
        uuidByString('calendar_create'),
        uuidByString('calendar_read'),
        uuidByString('calendar_update'),
        uuidByString('calendar_delete'),
        uuidByString('calendar_list')
      ]

      //delete targets
      await queryInterface.bulkDelete('Targets', { id: { [Op.in]: targetIds } }, { transaction: t })

      //delete permissions
      await queryInterface.bulkDelete('Permissions', { id: { [Op.in]: permissionIds } }, { transaction: t })

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
