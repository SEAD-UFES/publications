/** @format */

module.exports = app => {
  const api = app.api.selectiveProcesses
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('selectiveProcessApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)
    .get(api.listPublic, authApi.authenticationRequired, api.list)

  app.route(baseFolder + app.get('selectiveProcessApiRoute') + '/filters').get(api.filters)

  app
    .route(baseFolder + app.get('selectiveProcessApiRoute') + '/:id')
    .get(api.specificPublic, authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
