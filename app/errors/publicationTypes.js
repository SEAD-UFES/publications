module.exports = app => {
  let error = {};

  error.parse = (code, e) => {
    let message = {};

    switch (code) {
      case 'publicationTypes-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo propriedade name.'
        };
        break;

      case 'publicationTypes-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        };
        break;
      case 'publicationTypes-03':
        message = {
          code,
          userMessage: 'Já existe um tipo de publicação com esse nome.',
          devMessage: e
        };
        break;
      case 'publicationTypes-04':
        message = {
          code,
          userMessage: 'O tipo de publicação requisitado não pode ser encontrado.',
          devMessage: e
        };
        break;
    }

    return message;
  }

  return error;
}
