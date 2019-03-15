module.exports = app => {
  let error = {};

  error.parse = (code, e) => {
    let message = {};

    switch (code) {
      case 'publications-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
            devMessage: 'Essa requisição espera um objeto contendo uma referência a um Processo Seletivo e um Tipo de Publicação.'
        };
        break;

      case 'publications-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        };
        break;
      case 'publications-03':
        message = {
          code,
          userMessage: 'A publicação requisitada não pode ser encontrada.',
          devMessage: e
        };
        break;
    }

    return message;
  }

  return error;
}
