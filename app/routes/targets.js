/** @format */

module.exports = app => {
  const api = app.api.targets
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('targetApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list)

  app
    .route(baseFolder + app.get('targetApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
