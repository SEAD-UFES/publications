/** @format */

module.exports = app => {
  const api = app.api.permissions
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('permissionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list)

  app
    .route(baseFolder + app.get('permissionApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
