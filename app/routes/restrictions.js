/** @format */

module.exports = app => {
  const api = app.api.restrictions
  const authApi = app.api.auth

  app
    .route(app.get('restrictionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(api.list)

  app
    .route(app.get('restrictionApiRoute') + '/:id')
    .get(api.read)
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
