/** @format */

module.exports = app => {
  const api = app.api.steps
  const authApi = app.api.auth

  app.route(app.get('stepApiRoute')).post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('stepApiRoute') + '/:id')
    .get(authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
