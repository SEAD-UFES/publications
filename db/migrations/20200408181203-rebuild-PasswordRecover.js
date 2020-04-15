/** @format */

'use strict'

const { getDeletedLines, truncateDeletedLines } = require('../helpers/migrationHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id: ok

      //user_id: ok

      //token
      await queryInterface.removeConstraint('PasswordRecovers', 'token', { transaction: t })

      //createdAt ok

      //updatedAt ok

      //deletedAt ok

      //isActive
      await queryInterface.addColumn(
        'PasswordRecovers',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //uniqueKeys
      await queryInterface.addConstraint(
        'PasswordRecovers',
        ['token', 'isActive'],
        {
          type: 'unique',
          name: 'unique_token_isActive'
        },
        { transaction: t }
      )
    } catch (error) {
      console.log('Erro em up: ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //deletar dados da migration para evitar errors de consistencia.
      const linesToDelete = await getDeletedLines(queryInterface, 'PasswordRecovers')
      if (linesToDelete.length > 0) await truncateDeletedLines(queryInterface, 'PasswordRecovers')

      //id: ok

      //user_id: ok

      //token
      await queryInterface.addConstraint(
        'PasswordRecovers',
        ['token'],
        { type: 'unique', name: 'token' },
        { transaction: t }
      )

      //createdAt ok

      //updatedAt ok

      //deletedAt ok

      //uniqueKeys
      await queryInterface.removeConstraint('PasswordRecovers', 'unique_token_isActive', { transaction: t })

      //isActive
      await queryInterface.removeColumn('PasswordRecovers', 'isActive', { transaction: t })
    } catch (error) {
      console.log('Erro em down: ', error)
      t.rollback()
      throw error
    }
  }
}
