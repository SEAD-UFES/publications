/** @format */

module.exports = app => {
  const api = app.api.userRoles
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('userRoleApiRoute'))
    .post(authApi.authenticationRequired, authApi.globalPermissionRequired, api.create)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.list)

  app
    .route(baseFolder + app.get('userRoleApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.globalPermissionRequired, api.delete)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.specific)
}
