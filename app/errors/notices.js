/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'calls-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: e
        }
        break

      case 'calls-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
      case 'calls-03':
        message = {
          code,
          userMessage: 'Já existe uma chamada com esse nome.',
          devMessage: e
        }
        break
      case 'calls-04':
        message = {
          code,
          userMessage: 'A chamada requisitada não pode ser encontrada.',
          devMessage: e
        }
        break
      case 'calls-05':
        message = {
          code,
          userMessage: 'Não é possível mais de uma chamada no mesmo intervalo de tempo.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
