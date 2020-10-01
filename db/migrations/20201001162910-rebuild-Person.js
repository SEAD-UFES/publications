/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (OK)
      //user_id  (OK)

      //cpf (remover unique para paranoid funcionar)
      await queryInterface.removeConstraint('People', 'cpf', { transaction: t })

      //name  (OK)
      //surname  (OK)
      //birthdate (OK)
      //nationality (OK)
      //rgNumber (OK)
      //rgDispatcher (OK)
      //ethnicity (OK)
      //civilStatus (OK)
      //gender (OK)
      //createdAt (OK)
      //updatedAt (OK)
      //deletedAt (apagar cpf + recriar cpf = erro, paranoid está errado)

      //isActive (Adicionar)
      await queryInterface.addColumn(
        'People',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //unique key (cpf_isActive)
      await queryInterface.addConstraint(
        'People',
        ['cpf', 'isActive'],
        {
          type: 'unique',
          name: 'unique_cpf_isActive'
        },
        { transaction: t }
      )

      //commit transacttion
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201001162910-rebuild-Person (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //Remover todas as linhas "deletadas" com o paranoid para limpar o banco.
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('People', { deletedAt: { [Op.not]: null } }, { transaction: t })

      //unique key (remover cpf_isActive)
      await queryInterface.removeConstraint('People', 'unique_cpf_isActive', { transaction: t })

      //id (OK)
      //user_id  (OK)

      //cpf (retornar unique para cpf)
      await queryInterface.addConstraint('People', ['cpf'], { type: 'unique', name: 'cpf' }, { transaction: t })

      //name  (OK)
      //surname  (OK)
      //birthdate (OK)
      //nationality (OK)
      //rgNumber (OK)
      //rgDispatcher (OK)
      //ethnicity (OK)
      //civilStatus (OK)
      //gender (OK)
      //createdAt (OK)
      //updatedAt (OK)
      //deletedAt (OK)

      //isActive (Remover)
      await queryInterface.removeColumn('People', 'isActive', { transaction: t })

      //commit transacttion
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20201001162910-rebuild-Person (down): ', error)
      t.rollback()
      throw error
    }
  }
}
