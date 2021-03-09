/** @format */

module.exports = app => {
  const api = app.api.calendars
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('calendarApiRoute'))
    .get(api.list)
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(baseFolder + app.get('calendarApiRoute') + '/:id')
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)
}
