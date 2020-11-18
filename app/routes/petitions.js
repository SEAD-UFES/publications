/** @format */

module.exports = app => {
  const api = app.api.petitions
  const authApi = app.api.auth

  app
    .route(app.get('petitionApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app
    .route(app.get('petitionApiRoute') + '/:id')
    .get(authApi.authenticationRequired, api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
