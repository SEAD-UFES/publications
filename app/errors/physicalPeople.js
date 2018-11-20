module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'physicalPeople-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida. Você deve informar o cpf e o sobrenome',
                    devMessage: 'Essa requisição espera um objeto contendo cpf e sobrenome'
                };
                break;
            case 'physicalPeople-02': 
                message = {
                    code,
                    userMessage: 'CPF já cadastrado.',
                    devMessage: e
                };
                break;
            case 'physicalPeople-03': 
                message = {
                    code,
                    userMessage: 'Ocorreu erro na verificação. Cheque seus dados e tente novamente.',
                    devMessage: e
                };
                break;
            case 'physicalPeople-04': 
                message = {
                    code,
                    userMessage: 'Ocorreu um erro interno. Contate os administradores.',
                    devMessage: e
                };
                break;
            
        }

        return message;
    }
    
    return error;
}

