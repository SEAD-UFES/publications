/** @format */

module.exports = app => {
  const api = app.api.vacancies
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('vacancyApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(api.list)

  app
    .route(baseFolder + app.get('vacancyApiRoute') + '/:id')
    .put(authApi.authenticationRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
