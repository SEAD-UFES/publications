/** @format */

module.exports = app => {
  const api = app.api.inscriptions
  const authApi = app.api.auth

  app
    .route(app.get('inscriptionApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app
    .route(app.get('inscriptionApiRoute') + '/:id')
    .get(authApi.authenticationRequired, authApi.adminRequired, api.read)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
