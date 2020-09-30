/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (Ok)
      //name (Ok)
      //urn (Ok)
      //target_id (Ok)
      //action_id (Ok)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Targets',
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
      console.log('Erro em 20200930113354-rebuild-Target (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Targets', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (Ok)
      //name (Ok)
      //urn (Ok)
      //target_id (Ok)
      //action_id (Ok)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (remover)
      await queryInterface.removeColumn('Targets', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20200930113354-rebuild-Target (down): ', error)
      t.rollback()
      throw error
    }
  }
}
