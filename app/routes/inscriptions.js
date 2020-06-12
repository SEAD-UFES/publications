/** @format */

module.exports = app => {
  const api = app.api.inscriptions
  const authApi = app.api.auth

  app
    .route(app.get('inscriptionApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app
    .route(app.get('inscriptionApiRoute') + '/:id')
    .get(authApi.authenticationRequired, api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
