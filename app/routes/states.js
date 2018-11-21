module.exports = app => {
  const api = app.api.states;
  const authApi = app.api.auth;

  app.route(app.get('stateApiRoute'))
    .get(authApi.authenticationRequired, api.list);

  app.route(app.get('stateApiRoute')+"/:data")
    .get(authApi.authenticationRequired, api.specific);
}
