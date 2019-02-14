module.exports = app => {
  const api = app.api.me;
  const authApi = app.api.auth;

  app.route(app.get('meApiRoute'))
    .get(authApi.authenticationRequired, api.me)
    .put(authApi.authenticationRequired, api.update);
}
