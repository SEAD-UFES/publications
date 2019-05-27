module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'graduationTypes-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo name'
                };
                break;
            case 'graduationTypes-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'graduationTypes-03': 
                message = {
                    code,
                    userMessage: 'Não foi localizado o tipo de formação com o ID informado.',
                    devMessage: e
                };
                break;
        }

        return message;
    }
    
    return error;
}

