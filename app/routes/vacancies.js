module.exports = app => {
    const api = app.api.vacancies;
    const authApi = app.api.auth;

    app.route(app.get('vacancyApiRoute'))
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list);
    
    app.route(app.get('vacancyApiRoute')+"/:id")
        .put(authApi.authenticationRequired, api.update)
        .get(authApi.authenticationRequired, api.specif)
}