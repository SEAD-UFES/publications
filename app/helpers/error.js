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

const unauthorizedDevMessage = e => {
  return {
    name: 'unauthorizedError',
    errors: { message: e.message }
  }
}

const unknownDevMessage = e => {
  return {
    name: 'unknownError',
    errors: { message: e.message }
  }
}

module.exports = { idNotFoundDevMessage, validationDevMessage, unauthorizedDevMessage, unknownDevMessage }
