module.exports = app => {
    const api = app.api.steps;
    const authApi = app.api.auth;

    app.route(app.get('stepApiRoute'))
        .post(authApi.authenticationRequired, api.create);
    
    app.route(app.get('stepApiRoute') + "/:id")
        .get(authApi.authenticationRequired, api.specific)
        .put(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.update)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}
  