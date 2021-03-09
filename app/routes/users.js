/** @format */

module.exports = app => {
  const api = app.api.users
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('userApiRoute'))
    .post(authApi.authenticationRequired, authApi.globalPermissionRequired, api.create)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.list)

  app
    .route(baseFolder + app.get('userApiRoute') + '/minimal')
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.minimal)

  app
    .route(baseFolder + app.get('userApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.globalPermissionRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
