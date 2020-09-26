/** @format */

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //remove table content to prevent errors (calendar_id === null)
      await queryInterface.bulkDelete('InscriptionEvents', null, { transaction: t })

      //id (OK)

      //call_id (remove) and calendar_id (Add)
      await queryInterface.removeColumn('InscriptionEvents', 'call_id', { transaction: t })
      await queryInterface.addColumn(
        'InscriptionEvents',
        'calendar_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Calendars',
            key: 'id'
          },
          after: 'id'
        },
        { transaction: t }
      )

      //startDate (remove)
      await queryInterface.removeColumn('InscriptionEvents', 'startDate', { transaction: t })

      //endDate (remove)
      await queryInterface.removeColumn('InscriptionEvents', 'endDate', { transaction: t })

      //numberOfInscriptionsAllowed (OK)

      //allowMultipleAssignments (OK)

      //allowMultipleRegions (OK)

      //allowMultipleRestrictions (OK)

      //createdAt (Mofificar)
      await queryInterface.changeColumn(
        'InscriptionEvents',
        'createdAt',
        {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
          allowNull: false
        },
        { transaction: t }
      )

      //updatedAt (Modificar)
      await queryInterface.changeColumn(
        'InscriptionEvents',
        'updatedAt',
        {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
          allowNull: false
        },
        { transaction: t }
      )

      //deletedAt (Add)
      await queryInterface.addColumn(
        'InscriptionEvents',
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
      console.log('Erro em up: ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //remove table content to prevent errors (call_id === null)
      await queryInterface.bulkDelete('InscriptionEvents', null, { transaction: t })

      //id (OK)

      //call_id (Add again) and calendar_id (Remove)
      await queryInterface.addColumn(
        'InscriptionEvents',
        'call_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Calls',
            key: 'id'
          },
          after: 'id'
        },
        { transaction: t }
      )
      await queryInterface.removeColumn('InscriptionEvents', 'calendar_id', { transaction: t })

      //startDate (Add again)
      queryInterface.addColumn(
        'InscriptionEvents',
        'startDate',
        {
          type: Sequelize.DATE,
          allowNull: false,
          after: 'call_id'
        },
        { transaction: t }
      )

      //endDate (Add again)
      queryInterface.addColumn(
        'InscriptionEvents',
        'endDate',
        {
          type: Sequelize.DATE,
          allowNull: false,
          after: 'startDate'
        },
        { transaction: t }
      )

      //numberOfInscriptionsAllowed (OK)

      //allowMultipleAssignments (OK)

      //allowMultipleRegions (OK)

      //allowMultipleRestrictions (OK)

      //createdAt (return to previous)
      await queryInterface.changeColumn(
        'InscriptionEvents',
        'createdAt',
        {
          type: Sequelize.DATE,
          allowNull: false
        },
        { transaction: t }
      )

      //updatedAt (return to previous)
      await queryInterface.changeColumn(
        'InscriptionEvents',
        'updatedAt',
        {
          type: Sequelize.DATE,
          allowNull: false
        },
        { transaction: t }
      )

      //deletedAt (remove)
      await queryInterface.removeColumn('InscriptionEvents', 'deletedAt', { transaction: t })

      //commit transaction
      await t.commit()

      //if error
    } catch (error) {
      console.log('Erro em down: ', error)
      t.rollback()
      throw error
    }
  }
}
