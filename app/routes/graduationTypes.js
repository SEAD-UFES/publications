module.exports = app => {
  const api = app.api.graduationTypes;
  const authApi = app.api.auth;

  app.route(app.get('graduationTypeApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, authApi.adminRequired, api.list);

  app.route(app.get('graduationTypeApiRoute')+ "/:id")
    .get(authApi.authenticationRequired, api.specific)    
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}

