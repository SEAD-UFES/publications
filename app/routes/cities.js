module.exports = app => {
  const api = app.api.cities;
  const authApi = app.api.auth;

  app.route(app.get('cityApiRoute')+"/:state/state")
    .get(authApi.authenticationRequired, api.list);

  app.route(app.get('cityApiRoute')+"/:id")
    .get(authApi.authenticationRequired, api.specific);
}
