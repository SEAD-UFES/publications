module.exports = app => {
  let error = {};

  error.parse = (code, e) => {
    let message = {};

    switch(code) {
      case 'states-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo um token de acesso válido'
        };
        break;

      case 'states-02':
        message = {
          code,
          userMessage: 'Estado inexistente',
          devMessage: 'O id ou sigla fornecido na rota não corresponde a nenhum estado cadastrado'
        };
        break;

      case 'states-03':
        message = {
          code, 
          userMessage: 'Erro não especificado',
          devMessage: e.errors[0].message
        };
        break;
    }

    return message;
  }

  return error;
}
