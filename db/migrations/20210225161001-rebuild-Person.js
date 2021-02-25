/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (ok)
      //user_id (ok)
      //cpf (ok)
      //surname (ok)
      //birthdate
      //nationality
      //rgNumber
      //rgDispatcher
      //ethnicity (ok)
      //civilStatus (ok)
      //gender (ok)

      //fatherName - add father column
      await queryInterface.addColumn(
        'People',
        'fatherName',
        { type: Sequelize.STRING, after: 'gender' },
        { transaction: t }
      )

      //motherName - add mother column
      await queryInterface.addColumn(
        'People',
        'motherName',
        { type: Sequelize.STRING, after: 'fatherName' },
        { transaction: t }
      )
      //add dummy mother on previous entries
      await queryInterface.bulkUpdate('People', { motherName: '' }, { motherName: null }, { transaction: t })
      //make allow null = false on mother
      await queryInterface.changeColumn(
        'People',
        'motherName',
        { type: Sequelize.STRING, allowNull: false },
        { transaction: t }
      )

      //createdAt (ok)
      //updatedAt (ok)
      //deletedAt (ok)
      //isActive (ok)

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20210225161001-rebuild-Person (up): ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id (ok)
      //user_id (ok)
      //cpf (ok)
      //surname (ok)
      //birthdate
      //nationality
      //rgNumber
      //rgDispatcher
      //ethnicity (ok)
      //civilStatus (ok)
      //gender (ok)

      //fatherName - remove father column
      await queryInterface.removeColumn('People', 'fatherName', { transaction: t })

      //motherName - remove mother column
      await queryInterface.removeColumn('People', 'motherName', { transaction: t })

      //createdAt (ok)
      //updatedAt (ok)
      //deletedAt (ok)
      //isActive (ok)

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em 20210225161001-rebuild-Person (down): ', error)
      t.rollback()
      throw error
    }
  }
}
