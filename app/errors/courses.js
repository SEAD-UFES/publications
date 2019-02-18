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
            case 'courses-03':
                message = {
                    code,
                    userMessage: 'Curso não encontrado. Verifique o ID informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

