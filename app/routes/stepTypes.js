module.exports = app => {
    const api = app.api.stepTypes;
    const authApi = app.api.auth;

    app.route(app.get('stepTypeApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  