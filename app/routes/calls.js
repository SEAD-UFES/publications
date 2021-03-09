/** @format */

module.exports = app => {
  const api = app.api.calls
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('callApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)
    .get(api.list)

  app
    .route(baseFolder + app.get('callApiRoute') + '/:id')
    .get(api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)
}
