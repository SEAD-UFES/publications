/** @format */

module.exports = app => {
  const api = app.api.steps
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('stepApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(baseFolder + app.get('stepApiRoute') + '/:id')
    .get(authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
