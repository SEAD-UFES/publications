/** @format */

module.exports = app => {
  const api = app.api.userRoles
  const authApi = app.api.auth

  app
    .route(app.get('userRoleApiRoute'))
    .post(authApi.authenticationRequired, authApi.globalPermissionRequired, api.create)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.list)

  app
    .route(app.get('userRoleApiRoute') + '/:id')
    .delete(authApi.authenticationRequired, authApi.globalPermissionRequired, api.delete)
    .get(authApi.authenticationRequired, authApi.globalPermissionRequired, api.specific)
}
