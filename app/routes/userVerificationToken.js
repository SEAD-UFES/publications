/** @format */

module.exports = app => {
  const api = app.api.userVerificationTokens
  const authApi = app.api.auth

  app.route(app.get('userVerificationTokenApiRoute') + '/send').get(authApi.authenticationRequired, api.send)

  app.route(app.get('userVerificationTokenApiRoute') + '/:token').get(api.verify)
}
