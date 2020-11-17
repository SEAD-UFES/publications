/** @format */

module.exports = app => {
  const api = app.api.petitionEvents
  const authApi = app.api.auth

  app.route(app.get('petitionEventApiRoute')).post(authApi.authenticationRequired, api.create).get(api.list)

  app
    .route(app.get('petitionEventApiRoute') + '/:id')
    .put(authApi.authenticationRequired, api.update)
    .get(api.read)
    .delete(authApi.authenticationRequired, api.delete)
}
