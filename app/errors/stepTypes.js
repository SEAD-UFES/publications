module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'stepTypes-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name e description'
                };
                break;
            case 'stepTypes-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'stepTypes-03': 
                message = {
                    code,
                    userMessage: 'Não foi localizado o tipo de etapa com o ID informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

