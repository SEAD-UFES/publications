/** @format */

module.exports = app => {
  const api = app.api.targets
  const authApi = app.api.auth

  app
    .route(app.get('targetApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list)

  app
    .route(app.get('targetApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
