module.exports = app => {
    const api = app.api.vacancies;
    const authApi = app.api.auth;

    app.route(app.get('vacancyApiRoute'))
        .post(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.create);
    
    app.route(app.get('vacancyApiRoute')+"/:id")
        .put(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.update)
        .get(authApi.authenticationRequired, authApi.checkCourseStaff, authApi.checkAccessLevel, api.specific)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete);
}

