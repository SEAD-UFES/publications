module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'people-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida. Você deve informar o cpf e o sobrenome',
                    devMessage: 'Essa requisição espera um objeto contendo cpf e sobrenome'
                };
                break;
            case 'people-02': 
                message = {
                    code,
                    userMessage: 'CPF já cadastrado.',
                    devMessage: e
                };
                break;
            case 'people-03': 
                message = {
                    code,
                    userMessage: 'Ocorreu erro na verificação. Cheque seus dados e tente novamente.',
                    devMessage: e
                };
                break;
            case 'people-04': 
                message = {
                    code,
                    userMessage: 'Ocorreu um erro interno. Contate os administradores.',
                    devMessage: e
                };
                break;
            case 'people-05': 
                message = {
                    code,
                    userMessage: 'Requisição inválida: Usuário não encontrado com o id informado.',
                    devMessage: e
                };
                break;
            
        }

        return message;
    }
    
    return error;
}

