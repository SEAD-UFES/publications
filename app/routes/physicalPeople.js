module.exports = app => {
    const api = app.api.physicalPeople;
    const authApi = app.api.auth;

    app.route(app.get('physicalPersonApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create);
}