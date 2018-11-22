module.exports = app => {
  let error = {};

  error.parse = (code, e) => {
    let message = {};

    switch(code) {

      case 'cities-01':
        message = {
          code, 
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo um token de acesso.'
        };
        break;

      case 'cities-02':
        message = {
          code,
          userMessage: 'Cidade inexistente',
          devMessage: e.errors[0].message
        };
        break;

      case 'cities-03':
        message = {
          code,
          userMessage: 'Erro interno do servidor, contate os administradores.',
          devMessage: e.errors[0].message
        };
        break;

      case 'cities-04':
        message = {
          code,
          userMessage: 'Estado inexistente',
          devMessage: 'O estado fornecido não existe no banco de dados.',
        };
        break;
    }

    return message;
  }
  
  return error;
}
