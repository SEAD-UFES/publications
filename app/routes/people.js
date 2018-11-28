module.exports = app => {
    const api = app.api.people;
    const authApi = app.api.auth;

    app.route(app.get('personApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create);
    
    app.route(app.get('personApiRoute')+"/:id")
        .get(authApi.authenticationRequired, api.specific)
        .put(authApi.authenticationRequired, api.update);

}
