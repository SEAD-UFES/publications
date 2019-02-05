module.exports = app => {
    const api = app.api.permissions;
    const authApi = app.api.auth;

    app.route(app.get('permissionApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  