module.exports = app => {
    const api = app.api.restrictions;
    const authApi = app.api.auth;

    app.route(app.get('restrictionApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
  