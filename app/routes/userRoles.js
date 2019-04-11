module.exports = app => {
    const api = app.api.userRoles;
    const authApi = app.api.auth;

    app.route(app.get('userRoleApiRoute'))
      .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
      .get(authApi.authenticationRequired, authApi.adminRequired, api.list);

    app.route(app.get('userRoleApiRoute')+'/:id')
      .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
      .get(authApi.authenticationRequired, authApi.adminRequired, api.specific);
}
