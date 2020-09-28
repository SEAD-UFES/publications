/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (Ok)

      //roleType_id (Alterar) - Don't allow null
      //Não coloquei "references" mas elas continuam lá.
      await queryInterface.changeColumn(
        'RolePermissions',
        'roleType_id',
        {
          type: Sequelize.UUID,
          allowNull: false
        },
        { transaction: t }
      )

      //permission_id (Alterar)  - Don't allow null
      //Não coloquei "references" mas elas continuam lá.
      await queryInterface.changeColumn(
        'RolePermissions',
        'permission_id',
        {
          type: Sequelize.UUID,
          allowNull: false
        },
        { transaction: t }
      )

      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'RolePermissions',
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
      console.log('Erro em 20200926120901-rebuild-RolePermission (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('RolePermissions', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (Ok)

      //roleType_id (Reverter)
      //Não coloquei "references" mas elas continuam lá.
      await queryInterface.changeColumn(
        'RolePermissions',
        'roleType_id',
        {
          type: Sequelize.UUID
        },
        { transaction: t }
      )

      //permission_id (Reverter)
      //Não coloquei "references" mas elas continuam lá.
      await queryInterface.changeColumn(
        'RolePermissions',
        'permission_id',
        {
          type: Sequelize.UUID
        },
        { transaction: t }
      )

      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (remover)
      await queryInterface.removeColumn('RolePermissions', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20200926120901-rebuild-Permission (down): ', error)
      t.rollback()
      throw error
    }
  }
}
