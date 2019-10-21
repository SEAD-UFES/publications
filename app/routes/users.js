/** @format */

module.exports = app => {
  const api = app.api.users
  const authApi = app.api.auth

  app
    .route(app.get('userApiRoute'))
    .post(authApi.authenticationRequired, authApi.globalPermissionRequired, api.create)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.list)

  app
    .route(app.get('userApiRoute') + '/minimal')
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.minimal)

  app
    .route(app.get('userApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.globalPermissionRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
