module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'auth-01':
        message = {
          code,
          userMessage: 'Usuário não autorizado, contate os administradores.',
          devMessage: e.message
        }
    }

    return message
  }

  return error
}
