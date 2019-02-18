module.exports = app => {
    const api = app.api.courses;
    const authApi = app.api.auth;

    app.route(app.get('courseApiRoute'))
        .post(authApi.authenticationRequired, authApi.checkAccessLevel, api.create)
        .get(authApi.authenticationRequired, api.list);
}