module.exports = app => {
    const api = app.api.actions;
    const authApi = app.api.auth;

    app.route(app.get('actionApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  