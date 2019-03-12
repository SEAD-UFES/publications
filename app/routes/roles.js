module.exports = app => {
    const api = app.api.roles;
    const authApi = app.api.auth;

    app.route(app.get('roleApiRoute'))
      .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
      .get(authApi.authenticationRequired, authApi.adminRequired, api.list);

    app.route(app.get('roleApiRoute')+'/:id')
      .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}
