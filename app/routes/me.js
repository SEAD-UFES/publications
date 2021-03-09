/** @format */

module.exports = app => {
  const api = app.api.me
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('meApiRoute'))
    .get(authApi.authenticationRequired, api.me)
    .put(authApi.authenticationRequired, api.update)
}
