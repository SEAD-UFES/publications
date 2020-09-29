/** @format */

module.exports = app => {
  const api = app.api.permissions
  const authApi = app.api.auth

  app
    .route(app.get('permissionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list)

  app
    .route(app.get('permissionApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
