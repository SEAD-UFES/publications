module.exports = app => {
    const api = app.api.steps;
    const authApi = app.api.auth;

    app.route(app.get('stepApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  