/** @format */

module.exports = app => {
  const api = app.api.states
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app.route(baseFolder + app.get('stateApiRoute')).get(authApi.authenticationRequired, api.list)

  app.route(baseFolder + app.get('stateApiRoute') + '/:data').get(authApi.authenticationRequired, api.specific)
}
