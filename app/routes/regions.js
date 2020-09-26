/** @format */

module.exports = app => {
  const api = app.api.regions
  const authApi = app.api.auth

  app
    .route(app.get('regionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(api.list)

  app
    .route(app.get('regionApiRoute') + '/:id')
    .get(api.read)
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
