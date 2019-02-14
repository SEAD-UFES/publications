module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'auth-01': 
                message = {
                    code,
                    userMessage: 'Token de acesso expirado',
                    devMessage: e
                };
                break;
            case 'auth-02': 
                message = {
                    code,
                    userMessage: 'Ocorreu uma falha na autenticação',
                    devMessage: e
                };
                break;
            case 'auth-03': 
                message = {
                    code,
                    userMessage: 'Requisição Inválida.',
                    devMessage: e
                };
                break;
            case 'auth-04': 
                message = {
                    code,
                    userMessage: 'Login não encontrado.',
                    devMessage: e
                };
                break;
            case 'auth-05': 
                message = {
                    code,
                    userMessage: 'Senha inválida.',
                    devMessage: e
                };
                break;
            case 'auth-06': 
                message = {
                    code,
                    userMessage: 'Erro interno no servidor, contate os administradores.',
                    devMessage: e
                };
                break;
            case 'auth-07': 
                message = {
                    code,
                    userMessage: 'A autenticação falhou.',
                    devMessage: e
                };
                break;
            case 'auth-08': 
                message = {
                    code,
                    userMessage: 'Você não tem permissão para acessar este recurso.',
                    devMessage: e
                };
                break;
            case 'auth-09': 
                message = {
                    code,
                    userMessage: 'Usuário não autorizado, contate os administradores.',
                    devMessage: e.message
                };
                break;
            case 'auth-10': 
                message = {
                    code,
                    userMessage: 'Este recurso requer elevação de privilégios.',
                    devMessage: e.message
                };
                break;
            case 'auth-11': 
                message = {
                    code,
                    userMessage: 'Você não possui permissões neste curso.',
                    devMessage: e.message
                };
                break;
        }

        return message;
    }
    
    return error;
}

