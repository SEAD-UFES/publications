/** @format */

module.exports = app => {
  const api = app.api.inscriptionEvents
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('inscriptionEventApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(api.list)

  app
    .route(baseFolder + app.get('inscriptionEventApiRoute') + '/:id')
    .put(authApi.authenticationRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
