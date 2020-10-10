/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (ok)
      //name (ok)
      //description (ok)
      //createdAt (ok)
      //updatedAt (ok)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Regions',
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
      console.log('Erro em 20201010143609-rebuild-Region (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Regions', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (ok)
      //name (ok)
      //description (ok)
      //createdAt (ok)
      //updatedAt (ok)

      //deletedAt (Remover)
      await queryInterface.removeColumn('Regions', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201010143609-rebuild-Region (down): ', error)
      t.rollback()
      throw error
    }
  }
}
