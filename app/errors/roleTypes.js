module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'roleTypes-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name e description'
                };
                break;
            case 'roleTypes-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'roleTypes-03': 
                message = {
                    code,
                    userMessage: 'Não foi localizado o tipo de permissão com o ID informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

