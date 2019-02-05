module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'vacancies-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo qtd e reserve'
                };
                break;
            case 'vacancies-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'vacancies-03': 
                message = {
                    code,
                    userMessage: 'Não foi possível localizar a vaga.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

