module.exports = app => {
  const api = app.api.notices
  const authApi = app.api.auth

  app.route(app.get('noticeApiRoute')).post(authApi.authenticationRequired, api.create)

  app
    .route(app.get('noticeApiRoute') + '/:id')
    .get(api.specific)
    .put(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.delete)
}
