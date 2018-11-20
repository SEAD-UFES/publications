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
        }

        return message;
    }
    
    return error;
}

