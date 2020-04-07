const idNotFoundDevMessage = () => {
  return {
    name: 'ValidationError',
    errors: { id: 'Não existe um elemento com o identificador enviado.' },
  }
}

module.exports = { idNotFoundDevMessage }
