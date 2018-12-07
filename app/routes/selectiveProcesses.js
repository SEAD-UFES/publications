module.exports = app => {

  const api = app.api.selectiveProcesses;
  const authApi = app.api.auth;

  app.route(app.get('selectiveProcessApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(authApi.authenticationRequired, api.list);

  app.route(app.get('selectiveProcessApiRoute')+"/:id")
    .get(authApi.authenticationRequired, api.specific)
    .put(authApi.authenticationRequired, api.update)
    .delete(authApi.authenticationRequired, api.delete);
}

