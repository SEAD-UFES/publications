/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'notices-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: e
        }
        break

      case 'notices-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
      case 'notices-03':
        message = {
          code,
          userMessage: 'Já existe uma chamada com esse nome.',
          devMessage: e
        }
        break
      case 'notices-04':
        message = {
          code,
          userMessage: 'A notícia requisitada não pode ser encontrada.',
          devMessage: e
        }
        break
      case 'notices-05':
        message = {
          code,
          userMessage: 'Erro ao criar notícia.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
