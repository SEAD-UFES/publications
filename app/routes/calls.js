/** @format */

module.exports = app => {
  const api = app.api.calls
  const authApi = app.api.auth

  app.route(app.get('callApiRoute')).post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('callApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.checkAccessLevel, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)
}
