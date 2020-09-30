/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'targets-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo name e urn'
        }
        break
      case 'targets-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
      case 'target-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'target-401':
        message = {
          code,
          userMessage: 'Operação não autorizada.',
          devMessage: e
        }
        break
      case 'target-403':
        message = {
          code,
          userMessage: 'Operação proibida.',
          devMessage: e
        }
        break
      case 'target-500':
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
