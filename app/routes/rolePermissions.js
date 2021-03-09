/** @format */

module.exports = app => {
  const api = app.api.rolePermissions
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('rolePermissionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list)

  app
    .route(baseFolder + app.get('rolePermissionApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.adminRequired, api.read)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
