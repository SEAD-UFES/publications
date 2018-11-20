module.exports = app => {
    const api = app.api.roleTypes;
    const authApi = app.api.auth;

    app.route(app.get('roleTypeApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  