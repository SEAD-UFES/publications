module.exports = app => {
  const api = app.api.calls;
  const authApi = app.api.auth;

  app.route(app.get('callApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.create)
    .get(authApi.authenticationRequired, api.list);

  app.route(app.get('callApiRoute') + "/:id")
    .get(authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, api.update)
    .delete(authApi.authenticationRequired, api.delete);

}

