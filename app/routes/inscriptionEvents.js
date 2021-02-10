/** @format */

module.exports = app => {
  const api = app.api.inscriptionEvents
  const authApi = app.api.auth

  app.route(app.get('inscriptionEventApiRoute')).post(authApi.authenticationRequired, api.create).get(api.list)

  app
    .route(app.get('inscriptionEventApiRoute') + '/:id')
    .put(authApi.authenticationRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
