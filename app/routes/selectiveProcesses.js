module.exports = app => {

  const api = app.api.selectiveProcesses;
  const authApi = app.api.auth;

  app.route(app.get('selectiveProcessApiRoute'))
    .post(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.create)
    .get(api.list);

  app.route(app.get('selectiveProcessApiRoute')+"/:id")
    .get(api.specific)
    .put(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}

