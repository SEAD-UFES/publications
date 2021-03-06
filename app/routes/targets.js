module.exports = app => {
    const api = app.api.targets;
    const authApi = app.api.auth;

    app.route(app.get('targetApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  