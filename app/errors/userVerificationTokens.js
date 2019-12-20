/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'userVerificationTokens-01':
        message = {
          code,
          userMessage: 'Essa requisição espera uma chave de verficiação (token).',
          devMessage: e
        }
        break
      case 'userVerificationTokens-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor, contate os administradores.',
          devMessage: e
        }
        break
      case 'userVerificationTokens-03':
        message = {
          code,
          userMessage: 'A chave de verificação informada, não existe.',
          devMessage: e
        }
        break

      case 'userVerificationTokens-04':
        message = {
          code,
          userMessage: 'Esse usuário já foi verficado.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
