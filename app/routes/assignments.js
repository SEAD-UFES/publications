/** @format */

module.exports = app => {
  const api = app.api.assignments
  const authApi = app.api.auth

  app
    .route(app.get('assignmentApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app
    .route(app.get('assignmentApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.adminRequired, api.read)
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
