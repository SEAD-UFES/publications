/** @format */

'use strict'

const userRoleTable = 'UserRoles'

const getDeletedLines = async queryInterface => {
  try {
    return await queryInterface.sequelize.query(`SELECT * from ${userRoleTable} WHERE isActive IS NULL`, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const truncateDeletedLines = async queryInterface => {
  try {
    return await queryInterface.sequelize.query(`DELETE FROM ${userRoleTable} WHERE isActive IS NULL`, {
      type: queryInterface.sequelize.QueryTypes.DELETE
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const removeUserIdFK = `ALTER TABLE ${userRoleTable} DROP FOREIGN KEY \`userroles_ibfk_2\``
const restoreUserIdFK = `ALTER TABLE ${userRoleTable} ADD CONSTRAINT \`userroles_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`)  ON DELETE RESTRICT ON UPDATE RESTRICT`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //id ok
      //roleType_id ok
      //user_id ok
      //createdAt ok
      //updatedAt ok

      //deletedAt
      await queryInterface.addColumn(
        'UserRoles',
        'deletedAt',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction: t }
      )

      //isActive
      await queryInterface.addColumn(
        'UserRoles',
        'isActive',
        { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
        { transaction: t }
      )

      //remove FK (to remove indexes)
      await queryInterface.sequelize.query(removeUserIdFK, { transaction: t })

      //remove old index - se eu não remover e colocar ele é sobreposto.
      await queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })

      //add index paranoid
      await queryInterface.addIndex(
        'UserRoles',
        ['user_id', 'roleType_id', 'course_id', 'isActive'],
        {
          type: 'unique',
          name: 'unique_user_role_course_isActive'
        },
        { transaction: t }
      )

      //restore old index
      await queryInterface.addIndex(
        'UserRoles',
        ['user_id'],
        {
          name: 'user_id'
        },
        { transaction: t }
      )

      //restore FK
      await queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })
    } catch (error) {
      console.log('Erro em up: ', error)
      t.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction()
    try {
      //deletar dados da migration para evitar errors de consistencia.
      const linesToDelete = await getDeletedLines(queryInterface)
      if (linesToDelete.length > 0) await truncateDeletedLines(queryInterface)

      //id ok
      //roleType_id ok
      //user_id ok
      //createdAt ok
      //updatedAt ok

      //remove FK (to remove indexes)
      await queryInterface.sequelize.query(removeUserIdFK, { transaction: t })

      //remover indexes
      await queryInterface.removeIndex('UserRoles', 'unique_user_role_course_isActive', { transaction: t })
      await queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })

      //restore index (não pergunte...)
      await queryInterface.addIndex('UserRoles', ['user_id'], { name: 'user_id' }, { transaction: t })

      //restore FK
      await queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })

      //isActive
      await queryInterface.removeColumn('UserRoles', 'isActive', { transaction: t })

      //deletedAt
      await queryInterface.removeColumn('UserRoles', 'deletedAt', { transaction: t })
    } catch (error) {
      console.log('Erro em down: ', error)
      t.rollback()
      throw error
    }
  }
}
