module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'restrictions-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name e description'
                };
                break;
            case 'restrictions-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'restrictions-03': 
                message = {
                    code,
                    userMessage: 'Não foi possível localizar a restrição com o ID informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

