module.exports = app => {
    const api = app.api.roleTypes;
    const authApi = app.api.auth;

    app.route(app.get('roleTypeApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
        .get(authApi.authenticationRequired, api.list);
    
    app.route(app.get('roleTypeApiRoute')+"/:id")
        .get(authApi.authenticationRequired, api.specific)
        .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);

}
  