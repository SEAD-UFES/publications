/** @format */

module.exports = app => {
  const api = app.api.restrictions
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('restrictionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(api.list)

  app
    .route(baseFolder + app.get('restrictionApiRoute') + '/:id')
    .get(api.read)
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
