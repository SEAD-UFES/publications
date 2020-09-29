/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (Ok)
      //name (Ok)
      //description (Ok)
      //target_id (Ok)
      //action_id (Ok)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Permissions',
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
      console.log('Erro em 20200929200409-rebuild-Permission (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Permissions', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (Ok)
      //name (Ok)
      //description (Ok)
      //target_id (Ok)
      //action_id (Ok)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (remover)
      await queryInterface.removeColumn('Permissions', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20200929200409-rebuild-Permission (down): ', error)
      t.rollback()
      throw error
    }
  }
}
