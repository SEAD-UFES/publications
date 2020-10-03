/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (OK)
      //qtd (OK)
      //reserve (OK)

      //call_id (colocar AllowNull: false)
      await queryInterface.changeColumn(
        'Vacancies',
        'call_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          after: 'reserve'
        },
        { transaction: t }
      )

      //assignment_id (colocar AllowNull: false)
      await queryInterface.changeColumn(
        'Vacancies',
        'assignment_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          after: 'call_id'
        },
        { transaction: t }
      )

      //region_id (Apenas mudar posição)
      await queryInterface.changeColumn(
        'Vacancies',
        'region_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          after: 'assignment_id'
        },
        { transaction: t }
      )

      //restriction_id (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Adicionar)
      await queryInterface.addColumn(
        'Vacancies',
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
      console.log('Erro em 20201003131239-rebuild-Vacancy (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('Vacancies', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //id (OK)
      //qtd (OK)
      //reserve (OK)

      //call_id (colocar AllowNull: true)
      await queryInterface.changeColumn(
        'Vacancies',
        'call_id',
        {
          type: Sequelize.UUID,
          allowNull: true
        },
        { transaction: t }
      )

      //assignment_id (colocar AllowNull: true)
      await queryInterface.changeColumn(
        'Vacancies',
        'assignment_id',
        {
          type: Sequelize.UUID,
          allowNull: true
        },
        { transaction: t }
      )

      //region_id (OK)
      //restriction_id (OK)
      //createdAt (OK)
      //updatedAt (OK)

      //deletedAt (Remover)
      await queryInterface.removeColumn('Vacancies', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201003131239-rebuild-Vacancy (down): ', error)
      t.rollback()
      throw error
    }
  }
}
