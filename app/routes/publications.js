/** @format */

module.exports = app => {
  const api = app.api.publications
  const fileUpload = app.helpers.fileUpload
  const authApi = app.api.auth

  app
    .route(app.get('publicationApiRoute'))
    .post(
      authApi.authenticationRequired,
      authApi.checkAccessLevel,
      fileUpload.upload,
      fileUpload.handleError,
      api.create
    )

  app
    .route(app.get('publicationApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.checkAccessLevel, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)

  app.route(app.get('publicationApiRoute') + '/download/:file').get(api.download)
}
