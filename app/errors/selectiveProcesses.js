module.exports = app => {
  let error = {};

  error.parse = (code, e) => {
    let message = {};

    switch(code) {
      case 'selectiveProcesses-01' :
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: 'Há parametros inválidos na requisição.'
        };
        break;

      case 'selectiveProcesses-02' :
        message = {
          code,
          userMessage: 'Já há um processo seletivo com esse numero cadastrado.', 
          devMessage: e
        };
        break;

      case 'selectiveProcesses-03' :
        message = {
          code,
          userMessage: 'Ocorreu um erro na verificação dos dados. Tente novamente.',
          devMessage: e
        };
        break;

      case 'selectiveProcesses-04' :
        message = {
          code,
          userMessage: 'Ocorreu um erro interno. Contate os administradores.',
          devMessage: e
        };
        break;

      case 'selectiveProcesses-05' :
        message = {
          code,
          userMessage: 'Requisição inválida: não há nenhum Processo Seletivo com o id informado.',
          devMessage: e
        };
        break;

    }

    return message;
  }

  return error;
}

