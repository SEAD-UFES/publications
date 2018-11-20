module.exports = app => {
    const api = app.api.users;
    const authApi = app.api.auth;

    app.route(app.get('userApiRoute'))
        .post(api.create)
        .get(authApi.authenticationRequired, api.list);
    
    app.route(app.get('userApiRoute')+"/:id")
        .get(authApi.authenticationRequired, api.specific)
        .put(authApi.authenticationRequired, api.update)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}

