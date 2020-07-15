/** @format */

module.exports = app => {
  const api = app.api.inscriptionEvents
  const authApi = app.api.auth

  app
    .route(app.get('inscriptionEventApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(api.list)

  app
    .route(app.get('inscriptionEventApiRoute') + '/:id')
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
