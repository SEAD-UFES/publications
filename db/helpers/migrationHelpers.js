/** @format */

const getDeletedLines = async (queryInterface, table) => {
  try {
    return await queryInterface.sequelize.query(`SELECT * from ${table} WHERE isActive IS NULL`, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const truncateDeletedLines = async (queryInterface, table) => {
  try {
    return await queryInterface.sequelize.query(`DELETE FROM ${table} WHERE isActive IS NULL`, {
      type: queryInterface.sequelize.QueryTypes.DELETE
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

module.exports = { getDeletedLines, truncateDeletedLines }
