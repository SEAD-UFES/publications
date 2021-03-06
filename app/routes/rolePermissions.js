module.exports = app => {
    const api = app.api.rolePermissions;
    const authApi = app.api.auth;

    app.route(app.get('rolePermissionApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  