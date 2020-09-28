/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (Ok)
      //name (OK)
      //description (Ok)
      //global (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'RoleTypes',
        'deletedAt',
        {
          type: Sequelize.DATE,
          defaultValue: null,
          allowNull: true
        },
        { transaction: t }
      )

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20200926120901-rebuild-RoleType (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('RoleTypes', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (Ok)
      //name (OK)
      //description (Ok)
      //global (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (remover)
      await queryInterface.removeColumn('RoleTypes', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20200926120901-rebuild-RoleType (down): ', error)
      t.rollback()
      throw error
    }
  }
}
