module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'register-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida. Cheque todos os campos requeridos e tente novamente.',
                    devMessage: 'Essa requisição espera um objeto com dados requeridos.'
                };
                break;
            case 'register-02': 
                message = {
                    code,
                    userMessage: 'Nome de e-mail já existe no banco de dados.',
                    devMessage: e.errors[0].message
                };
                break;
            case 'register-03': 
                message = {
                    code,
                    userMessage: 'Um ou mais dados do formulário são inválidos.',
                    devMessage: e.errors[0].message
                };
                break;
            case 'register-04':
                message = {
                    code,
                    userMessage: 'Erro interno no servidor. Entre em contato com o suporte.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

