module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'recover-400':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: e
        }
      case 'recover-404':
        message = {
          code,
          userMessage: 'Usuário inativo ou não existe',
          devMessage: e
        }
      case 'recover-500':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
    }

    return message
  }

  return error
}
