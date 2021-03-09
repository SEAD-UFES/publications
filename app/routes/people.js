/** @format */

module.exports = app => {
  const api = app.api.people
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('personApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)

  app.route(baseFolder + app.get('personApiRoute') + '/options').get(authApi.authenticationRequired, api.options)

  app
    .route(baseFolder + app.get('personApiRoute') + '/:id')
    .get(authApi.authenticationRequired, api.read)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
