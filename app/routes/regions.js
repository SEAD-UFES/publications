module.exports = app => {
    const api = app.api.regions;
    const authApi = app.api.auth;

    app.route(app.get('regionApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
        .get(authApi.authenticationRequired, api.list);
    
    app.route(app.get('regionApiRoute')+"/:id")
        .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}
  