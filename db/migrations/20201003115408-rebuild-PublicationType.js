/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (OK)

      //name (remove unique para paranoid funcionar)
      await queryInterface.removeConstraint('PublicationTypes', 'name', { transaction: t })

      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'PublicationTypes',
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
        'PublicationTypes',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //unique key (adicionar unique_name_isActive)
      await queryInterface.addConstraint(
        'PublicationTypes',
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
      console.log('Erro em 20201003115408-rebuild-PublicationType (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('PublicationTypes', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //unique key (remover unique_name_isActive)
      await queryInterface.removeConstraint('PublicationTypes', 'unique_name_isActive', { transaction: t })

      //id (OK)

      //name (Retornar unique para name)
      await queryInterface.addConstraint(
        'PublicationTypes',
        ['name'],
        { type: 'unique', name: 'name' },
        { transaction: t }
      )

      //createdAt (OK)
      //updatedAt (OK)

      //isActive (Remover)
      await queryInterface.removeColumn('PublicationTypes', 'isActive', { transaction: t })

      //deletedAt (Remover)
      await queryInterface.removeColumn('PublicationTypes', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201003115408-rebuild-PublicationType (down): ', error)
      t.rollback()
      throw error
    }
  }
}
