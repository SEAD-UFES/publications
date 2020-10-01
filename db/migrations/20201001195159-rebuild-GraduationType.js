/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (OK)

      //name (Remover unique para paranoid funcionar)
      await queryInterface.removeConstraint('GraduationTypes', 'name', { transaction: t })

      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'GraduationTypes',
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
        'GraduationTypes',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //unique key (adicionar unique_name_isActive)
      await queryInterface.addConstraint(
        'GraduationTypes',
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
      console.log('Erro em 20201001195159-rebuild-GraduationType (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('GraduationTypes', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //unique key (remover unique_name_isActive)
      await queryInterface.removeConstraint('GraduationTypes', 'unique_name_isActive', { transaction: t })

      //id (OK)

      //name (Retornar unique para name)
      await queryInterface.addConstraint(
        'GraduationTypes',
        ['name'],
        { type: 'unique', name: 'name' },
        { transaction: t }
      )

      //createdAt (OK)
      //updatedAt (OK)

      //isActive (Remover)
      await queryInterface.removeColumn('GraduationTypes', 'isActive', { transaction: t })

      //deletedAt (Remover)
      await queryInterface.removeColumn('GraduationTypes', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201001195159-rebuild-GraduationType (down): ', error)
      t.rollback()
      throw error
    }
  }
}
