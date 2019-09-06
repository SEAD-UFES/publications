module.exports = app => {
  const api = app.api.notices
  const authApi = app.api.auth

  app
    .route(app.get('noticeApiRoute'))
    .get(api.list)
    .post(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('noticeApiRoute') + '/:id')
    .get(api.specific)
    .put(authApi.authenticationRequired, api.update)
    .delete(authApi.authenticationRequired, api.delete)
}
