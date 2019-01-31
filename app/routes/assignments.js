module.exports = app => {
    const api = app.api.assignments;
    const authApi = app.api.auth;

    app.route(app.get('assignmentApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  