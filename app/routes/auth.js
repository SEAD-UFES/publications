module.exports = app => {
  const api = app.api.auth

  app.route(app.get('authApiRoute')).post(api.authenticate)

  //post login to recover pass. Send a token to user via email. Return status message
  app.route(app.get(`${authApiRoute}/recover-password`)).post(api.recoverRequire)

  //post new password to the user. Return status message
  app.route(app.get(`${authApiRoute}/recover-password/:token`)).post(api.recoverChange)
}
