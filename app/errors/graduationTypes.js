/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'graduationTypes-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo name'
        }
        break

      case 'graduationTypes-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break

      case 'graduationTypes-03':
        message = {
          code,
          userMessage: 'Não foi localizado o tipo de formação com o ID informado.',
          devMessage: e
        }
        break

      case 'graduationTypes-04':
        message = {
          code,
          userMessage: 'Já existe outro tipo de formação com esse nome.',
          devMessage: {
            name: 'Já existe outro tipo de formação com esse nome.'
          }
        }
        break

      case 'graduationTypes-05':
        message = {
          code,
          userMessage: 'Existem cursos que fazem referência a esse registro, não é possível apagar.',
          devMessage: {
            id: 'Existem cursos que fazem referência a esse registro, não é possível apagar.'
          }
        }
        break
      case 'graduationType-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'graduationType-401':
        message = {
          code,
          userMessage: 'Operação não autorizada.',
          devMessage: e
        }
        break
      case 'graduationType-403':
        message = {
          code,
          userMessage: 'Operação proibida.',
          devMessage: e
        }
        break
      case 'graduationType-500':
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
