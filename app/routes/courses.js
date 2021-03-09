/** @format */

module.exports = app => {
  const api = app.api.courses
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('courseApiRoute'))
    .post(authApi.authenticationRequired, authApi.globalPermissionRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app.route(baseFolder + app.get('courseApiRoute') + '/find').get(api.find)

  app
    .route(baseFolder + app.get('courseApiRoute') + '/:id')
    .put(authApi.authenticationRequired, authApi.globalPermissionRequired, api.update)
    .get(authApi.authenticationRequired, api.specific)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
