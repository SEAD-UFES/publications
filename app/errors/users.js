module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'users-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo login e password'
                };
                break;
            case 'users-02': 
                message = {
                    code,
                    userMessage: 'Usuário já existe',
                    devMessage: e.errors[0].message
                };
                break;
            case 'users-03': 
                message = {
                    code,
                    userMessage: 'Tipo de usuário inválido',
                    devMessage: e.errors[0].message
                };
                break;
            case 'users-04':
                message = {
                    code,
                    userMessage: 'Erro interno no servidor. Entre em contato com o suporte.',
                    devMessage: e
                };
                break;
            case 'users-05':
                message = {
                    code,
                    userMessage: 'O usuário requisitado não pode ser encontrado.',
                    devMessage: 'O usuário requisitado não foi encontrado no banco. Verifique o id solicitado.'
                };
                break;
            
        }

        return message;
    }
    
    return error;
}

