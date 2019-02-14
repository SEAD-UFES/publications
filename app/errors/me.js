module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'me-01': 
                message = {
                    code,
                    userMessage: 'Erro de validação do perfil.',
                    devMessage: e.errors[0].message
                };
                break;
            case 'me-02': 
                message = {
                    code,
                    userMessage: 'Estes dados já se encontram associados a outro cadastro.',
                    devMessage: e.errors[0].message
                };
                break;
            case 'me-03':
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

