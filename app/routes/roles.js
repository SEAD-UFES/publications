module.exports = app => {
    const api = app.api.roles;
    const authApi = app.api.auth;

    app.route(app.get('roleApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create);
}