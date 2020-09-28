/** @format */

module.exports = app => {
  let error = {}

  error.parse = (code, e) => {
    let message = {}

    switch (code) {
      case 'rolePermissions-01':
        message = {
          code,
          userMessage: 'Requisição inválida',
          devMessage: 'Essa requisição espera um objeto contendo roleType_id e permission_id'
        }
        break
      case 'rolePermissions-02':
        message = {
          code,
          userMessage: 'Erro interno do servidor. Contate o administrador.',
          devMessage: e
        }
        break
      case 'rolePermissions-03':
        message = {
          code,
          userMessage: 'Essa atribuição de permissão não foi encontrada.',
          devMessage: 'RolePermission id not found.'
        }
        break
      case 'rolePermission-400':
        message = {
          code,
          userMessage: 'Requisição inválida.',
          devMessage: e
        }
        break
      case 'rolePermission-401':
        message = {
          code,
          userMessage: 'Operação não autorizada.',
          devMessage: e
        }
        break
      case 'rolePermission-403':
        message = {
          code,
          userMessage: 'Operação proibida.',
          devMessage: e
        }
        break
      case 'rolePermission-500':
        message = {
          code,
          userMessage: 'Erro interno do servidor.',
          devMessage: e
        }
        break
    }

    return message
  }

  return error
}
