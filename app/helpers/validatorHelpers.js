/** @format */

const { matches } = require('validator')

const isFullDateTime = value => {
  if (value === null) value = ''
  //Datas devem estar no formato: 'YYYY-MM-DD HH:mm:ss' para evitar problemas com UTC.
  const datetimeRegex = /^\d{4}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])[" "]([0-1][0-9]|2[0-3])[:]([0-5][0-9])[:]([0-5][0-9])$/
  return matches(value, datetimeRegex)
}

const isValidBool = value => [true, false, 0, 1].includes(value)

module.exports = { isFullDateTime, isValidBool }
