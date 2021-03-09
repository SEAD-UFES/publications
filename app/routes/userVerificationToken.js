/** @format */

module.exports = app => {
  const api = app.api.userVerificationTokens
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('userVerificationTokenApiRoute') + '/send')
    .get(authApi.authenticationRequired, api.send)

  app.route(baseFolder + app.get('userVerificationTokenApiRoute') + '/:token').get(api.verify)
}
