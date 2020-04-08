/** @format */

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id ok

        //login
        queryInterface.removeConstraint('Users', 'login', { transaction: t }),

        //password ok

        // userType (manter por enquanto)
        //queryInterface.removeColumn('Users', 'userType', { transaction: t }),

        //authorized ok

        //createdAt ok

        //updatedAt ok

        //deletedAt ok

        //isActive
        queryInterface
          .addColumn(
            'Users',
            'isActive',
            { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
            { transaction: t }
          )
          .then(() => {
            //uniqueKeys
            return queryInterface.addConstraint(
              'Users',
              ['login', 'isActive'],
              {
                type: 'unique',
                name: 'unique_login_isActive'
              },
              { transaction: t }
            )
          })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id ok

        //login
        queryInterface.addConstraint('Users', ['login'], { type: 'unique', name: 'login' }, { transaction: t }),

        //password ok

        // userType (manter por enquanto)
        // queryInterface.addColumn(
        //   'Users',
        //   'userType',
        //   { type: Sequelize.ENUM('ufes', 'sead'), allowNull: false, defaultValue: 'sead' },
        //   { transaction: t }
        // ),

        //authorized ok

        //createdAt ok

        //updatedAt ok

        //deletedAt ok

        //uniqueKeys
        queryInterface.removeConstraint('Users', 'unique_login_isActive', { transaction: t }).then(() => {
          //isActive
          return queryInterface.removeColumn('Users', 'isActive', { transaction: t })
        })
      ])
    })
  }
}
