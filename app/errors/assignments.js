module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'assignments-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name e description'
                };
                break;
            case 'assignments-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'assignments-03': 
                message = {
                    code,
                    userMessage: 'Não foi localizado com o id informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

