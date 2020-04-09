/** @format */

'use strict'

const removeUserIdFK = 'ALTER TABLE `database_development`.`userroles` DROP FOREIGN KEY `userroles_ibfk_2`'
const restoreUserIdFK =
  'ALTER TABLE `database_development`.`userroles` ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `database_development`.`users` (`id`)  ON DELETE RESTRICT ON UPDATE RESTRICT'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id ok
        //roleType_id ok
        //user_id ok
        //createdAt ok
        //updatedAt ok

        //deletedAt
        queryInterface
          .addColumn(
            'UserRoles',
            'deletedAt',
            {
              type: Sequelize.DATE,
              allowNull: true
            },
            { transaction: t }
          )
          .then(() => {
            //isActive
            return queryInterface.addColumn(
              'UserRoles',
              'isActive',
              { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
              { transaction: t }
            )
          })
          //remove FK
          .then(() => {
            queryInterface.sequelize.query(removeUserIdFK, { transaction: t })
          })
          //remove index
          .then(() => {
            return queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })
          })
          //add index paranoid
          .then(() => {
            return Promise.all([
              queryInterface.addIndex(
                'UserRoles',
                ['user_id', 'roleType_id', 'isActive'],
                {
                  type: 'unique',
                  name: 'unique_user_role_isActive'
                },
                { transaction: t }
              ),
              queryInterface.addIndex(
                'UserRoles',
                ['user_id'],
                {
                  name: 'user_id'
                },
                { transaction: t }
              )
            ])
          })
          //restore FK
          .then(() => {
            return queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })
          })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id ok
        //roleType_id ok
        //user_id ok
        //createdAt ok
        //updatedAt ok

        //uniqueKeys
        queryInterface.sequelize
          .query(removeUserIdFK, { transaction: t })
          .then(() => {
            return Promise.all([
              queryInterface.removeIndex('UserRoles', 'unique_user_role_isActive', { transaction: t }),
              queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })
            ])
          })
          .then(() => {
            //uniqueKeys
            return queryInterface.addIndex('UserRoles', ['user_id'], { name: 'user_id' }, { transaction: t })
          })
          .then(() => {
            return queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })
          })
          .then(() => {
            //isActive
            return queryInterface.removeColumn('UserRoles', 'isActive', { transaction: t })
          })
          .then(() => {
            //deletedAt
            return queryInterface.removeColumn('UserRoles', 'deletedAt', { transaction: t })
          })
      ])
    })
  }
}
