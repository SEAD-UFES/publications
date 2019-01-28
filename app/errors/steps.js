module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'steps-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Informe os dados corretamente.'
                };
                break;
            case 'stepTypes-02': 
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

