/** @format */

const { matches } = require('validator')

const isFullDateTime = value => {
  if (value === null) value = ''
  //Datas devem estar no formato: 'YYYY-MM-DD HH:mm:ss' para evitar problemas com UTC.
  const datetimeRegex = /^\d{4}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])[" "]([0-1][0-9]|2[0-3])[:]([0-5][0-9])[:]([0-5][0-9])$/
  return matches(value, datetimeRegex)
}

const isValidBool = value => [true, false, 0, 1].includes(value)

const isValidCPF = strCPF => {
  let Soma = 0
  let Resto

  //remover caracteres especiais.
  strCPF = strCPF.replace(/\.|-/g, '')

  //caso especial
  if (strCPF == '00000000000') return false

  //nonono
  for (var i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
  Resto = (Soma * 10) % 11
  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto !== parseInt(strCPF.substring(9, 10))) return false

  //nonono
  Soma = 0
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
  Resto = (Soma * 10) % 11
  if (Resto == 10 || Resto == 11) Resto = 0
  if (Resto !== parseInt(strCPF.substring(10, 11))) return false

  //pass on test
  return true
}

module.exports = { isFullDateTime, isValidBool, isValidCPF }
