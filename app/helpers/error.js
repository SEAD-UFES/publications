/** @format */

const idNotFoundDevMessage = () => {
  return {
    name: 'ValidationError',
    errors: { id: 'Não existe um elemento com o identificador enviado.' }
  }
}

const validationDevMessage = e => {
  return {
    name: 'ValidationError',
    errors: e
  }
}

module.exports = { idNotFoundDevMessage, validationDevMessage }
