/** @format */

module.exports = app => {
  const api = app.api.publications
  const fileUpload = app.helpers.fileUpload
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('publicationApiRoute'))
    .post(
      authApi.authenticationRequired,
      authApi.checkAccessLevel,
      fileUpload.upload,
      fileUpload.handleError,
      api.create
    )

  app
    .route(baseFolder + app.get('publicationApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.checkAccessLevel, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)

  app.route(baseFolder + app.get('publicationApiRoute') + '/download/:file').get(api.download)
}
