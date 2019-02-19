module.exports = app => {
    const api = app.api.vacancies;
    const authApi = app.api.auth;

    app.route(app.get('vacancyApiRoute'))
        .post(authApi.authenticationRequired, api.create);
    
    app.route(app.get('vacancyApiRoute')+"/:id")
        .put(authApi.authenticationRequired, api.update)
        .get(authApi.authenticationRequired, api.specif)
}