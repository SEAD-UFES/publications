module.exports = app => {
    let error = {};

    error.parse = (code, e) => {
        let message = {};

        switch(code){
            case 'rolePermissions-01': 
                message = {
                    code,
                    userMessage: 'Requisição inválida',
                    devMessage: 'Essa requisição espera um objeto contendo roleType_id e permission_id'
                };
                break;
            case 'rolePermissions-02': 
                message = {
                    code,
                    userMessage: 'Erro interno do servidor. Contate o administrador.',
                    devMessage: e
                };
                break;
            case 'rolePermissions-03':
                message = {
                  code, 
                  userMessage: 'Essa atribuição de permissão não foi encontrada.',
                  devMessage: 'RolePermission id not found.'
                };
                break;
        }

        return message;
    }
    
    return error;
}

