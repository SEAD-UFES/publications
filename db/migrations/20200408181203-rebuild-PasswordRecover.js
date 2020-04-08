/** @format */

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id: ok

        //user_id: ok

        //token
        queryInterface.removeConstraint('PasswordRecovers', 'token', { transaction: t }),

        //createdAt ok

        //updatedAt ok

        //deletedAt ok

        //isActive
        queryInterface
          .addColumn(
            'PasswordRecovers',
            'isActive',
            { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
            { transaction: t }
          )
          .then(() => {
            //uniqueKeys
            return queryInterface.addConstraint(
              'PasswordRecovers',
              ['token', 'isActive'],
              {
                type: 'unique',
                name: 'unique_token_isActive'
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
        //id: ok

        //user_id: ok

        //token
        queryInterface.addConstraint(
          'PasswordRecovers',
          ['token'],
          { type: 'unique', name: 'token' },
          { transaction: t }
        ),

        //createdAt ok

        //updatedAt ok

        //deletedAt ok

        //uniqueKeys
        queryInterface.removeConstraint('PasswordRecovers', 'unique_token_isActive', { transaction: t }).then(() => {
          //isActive
          return queryInterface.removeColumn('PasswordRecovers', 'isActive', { transaction: t })
        })
      ])
    })
  }
}
