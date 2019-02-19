module.exports = app => {
    const api = app.api.stepTypes;
    const authApi = app.api.auth;

    app.route(app.get('stepTypeApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
    
    app.route(app.get('stepTypeApiRoute')+"/:id")
        .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
  