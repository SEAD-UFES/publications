/** @format */

'use strict'

const { getDeletedLines, truncateDeletedLines } = require('../helpers/migrationHelpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id ok

      //login
      await queryInterface.removeConstraint('Users', 'login', { transaction: t })

      //password ok

      // userType (manter por enquanto)
      //queryInterface.removeColumn('Users', 'userType', { transaction: t }),

      //authorized ok

      //createdAt ok

      //updatedAt ok

      //deletedAt ok

      //isActive
      await queryInterface.addColumn(
        'Users',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //uniqueKeys
      await queryInterface.addConstraint(
        'Users',
        ['login', 'isActive'],
        {
          type: 'unique',
          name: 'unique_login_isActive'
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
      const linesToDelete = await getDeletedLines(queryInterface, 'Users')
      if (linesToDelete.length > 0) await truncateDeletedLines(queryInterface, 'Users')

      //id ok

      //login
      await queryInterface.addConstraint('Users', ['login'], { type: 'unique', name: 'login' }, { transaction: t })

      //password ok

      // userType (manter por enquanto)
      // queryInterface.addColumn(
      //   'Users',
      //   'userType',
      //   { type: Sequelize.ENUM('ufes', 'sead'), allowNull: false, defaultValue: 'sead' },
      //   { transaction: t }
      // ),

      //authorized ok

      //createdAt ok

      //updatedAt ok

      //deletedAt ok

      //uniqueKeys
      await queryInterface.removeConstraint('Users', 'unique_login_isActive', { transaction: t })

      //isActive
      await queryInterface.removeColumn('Users', 'isActive', { transaction: t })
    } catch (error) {
      console.log('Erro em down: ', error)
      t.rollback()
      throw error
    }
  }
}
