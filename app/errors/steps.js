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
            case 'steps-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'steps-03': 
                message = {
                    code,
                    userMessage: 'Sua requisição não pode ser processada com as datas informadas.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

