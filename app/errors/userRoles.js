module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'userRoles-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo roleType_id e user_id'
                };
                break;
            case 'userRoles-02': 
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