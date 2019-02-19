module.exports = app => {
    const api = app.api.restrictions;
    const authApi = app.api.auth;

    app.route(app.get('restrictionApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
        .get(authApi.authenticationRequired, api.list)

    app.route(app.get('restrictionApiRoute')+"/:id")
       .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
       .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
  