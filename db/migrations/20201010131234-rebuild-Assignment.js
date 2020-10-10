/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (ok)

      //name (remover unique para paranoid funcionar)
      await queryInterface.removeConstraint('Assignments', 'name', { transaction: t })

      //description (ok)
      //createdAt (ok)
      //updatedAt (ok)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Assignments',
        'deletedAt',
        {
          type: Sequelize.DATE,
          defaultValue: null,
          allowNull: true
        },
        { transaction: t }
      )

      //isActive ((Adicionar para ter unique e paranoid)
      await queryInterface.addColumn(
        'Assignments',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //uniquekey (adicionar unique_name_isActive)
      await queryInterface.addConstraint(
        'Assignments',
        ['name', 'isActive'],
        {
          type: 'unique',
          name: 'unique_name_isActive'
        },
        { transaction: t }
      )

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201010131234-rebuild-Assignment (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Assignments', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //uniquekey (remover unique_name_isActive)
      await queryInterface.removeConstraint('Assignments', 'unique_name_isActive', { transaction: t })

      //id (ok)

      //name (devolver unique para name)
      await queryInterface.addConstraint('Assignments', ['name'], { type: 'unique', name: 'name' }, { transaction: t })

      //description (ok)
      //createdAt (ok)
      //updatedAt (ok)

      //isActive (Remover)
      await queryInterface.removeColumn('Assignments', 'isActive', { transaction: t })

      //deletedAt (Remover)
      await queryInterface.removeColumn('Assignments', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201010131234-rebuild-Assignment (down): ', error)
      t.rollback()
      throw error
    }
  }
}
