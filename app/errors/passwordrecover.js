module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'recover-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'recover-404':
        message = {
          code,
          userMessage: 'Recurso não encontrado.',
          devMessage: e
        }
        break
      case 'recover-500':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
