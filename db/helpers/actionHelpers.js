/** @format */

const createActionIdsByName = async queryInterface => {
  const actionLines = await queryInterface.sequelize.query(`SELECT id, name FROM Actions`, {
    type: queryInterface.sequelize.QueryTypes.SELECT
  })

  let idsByName = {}
  for (const el of actionLines) idsByName[el.name] = el.id

  return idsByName
}

module.exports = { createActionIdsByName }
