module.exports = app => {
  const api = app.api.notice
  const authApi = app.api.auth

  app
    .route(app.get('noticeApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.create)

  app
    .route(app.get('noticeApiRoute') + '/:id')
    .get(api.specific)
    .put(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.delete)
}
