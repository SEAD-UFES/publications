/** @format */

module.exports = app => {
  const api = app.api.notices
  const authApi = app.api.auth

  app
    .route(app.get('noticeApiRoute'))
    .get(api.listPublic, authApi.authenticationRequired, api.list)
    .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('noticeApiRoute') + '/:id')
    .get(api.specificPublic, authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkAccessLevel, api.delete)
}
