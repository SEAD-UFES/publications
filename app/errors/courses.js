module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'courses-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name e description'
                };
                break;
            case 'courses-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

