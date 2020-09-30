/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'actions-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo name e description'
        }
        break
      case 'actions-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
      case 'action-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'action-401':
        message = {
          code,
          userMessage: 'Operação não autorizada.',
          devMessage: e
        }
        break
      case 'action-403':
        message = {
          code,
          userMessage: 'Operação proibida.',
          devMessage: e
        }
        break
      case 'action-500':
        message = {
          code,
          userMessage: 'Erro interno do servidor.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
