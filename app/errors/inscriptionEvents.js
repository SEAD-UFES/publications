/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'inscriptionEvents-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo startDate e endDate. '
        }
        break
      case 'inscriptionEvents-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate os administradores.',
          devMessage: e
        }
        break
      case 'inscriptionEvents-03':
        message = {
          code,
          userMessage: 'Não foi possível encontrar a inscrição com o id informado.',
          devMessage: e
        }
        break
      case 'inscriptionEvent-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'inscriptionEvent-401':
        message = {
          code,
          userMessage: 'Operação não autorizada.',
          devMessage: e
        }
        break
      case 'inscriptionEvent-403':
        message = {
          code,
          userMessage: 'Operação proibida.',
          devMessage: e
        }
        break
      case 'inscriptionEvent-500':
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
