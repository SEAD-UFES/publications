/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (OK)
      //graduationType_id (OK)

      //name (Remover unique para aplicar paranoid)
      await queryInterface.removeConstraint('Courses', 'name', { transaction: t })

      //description (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Courses',
        'deletedAt',
        {
          type: Sequelize.DATE,
          defaultValue: null,
          allowNull: true
        },
        { transaction: t }
      )

      //isActive (Adicionar para ter unique e paranoid)
      await queryInterface.addColumn(
        'Courses',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //unique key (adicionar unique_name_isActive)
      await queryInterface.addConstraint(
        'Courses',
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
      console.log('Erro em 20201001185646-rebuild-Course (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Courses', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //unique key (remover unique_name_isActive)
      await queryInterface.removeConstraint('Courses', 'unique_name_isActive', { transaction: t })

      //id (OK)
      //graduationType_id (OK)

      //name (Retornar unique para name)
      await queryInterface.addConstraint('Courses', ['name'], { type: 'unique', name: 'name' }, { transaction: t })

      //description (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //isActive (Remover)
      await queryInterface.removeColumn('Courses', 'isActive', { transaction: t })

      //deletedAt (Remover)
      await queryInterface.removeColumn('Courses', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201001185646-rebuild-Course (down): ', error)
      t.rollback()
      throw error
    }
  }
}
