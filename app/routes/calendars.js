/** @format */

module.exports = app => {
  const api = app.api.calendars
  const authApi = app.api.auth

  app
    .route(app.get('calendarApiRoute'))
    .get(api.list)
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('calendarApiRoute') + '/:id')
    //.put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .get(api.read)
  //.delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)
}
