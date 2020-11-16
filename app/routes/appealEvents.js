/** @format */

module.exports = app => {
  const api = app.api.appealEvents
  const authApi = app.api.auth

  app.route(app.get('appealEventApiRoute')).post(authApi.authenticationRequired, api.create).get(api.list)

  app
    .route(app.get('appealEventApiRoute') + '/:id')
    .put(authApi.authenticationRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
