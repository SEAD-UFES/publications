/** @format */

module.exports = app => {
  const api = app.api.register

  app.route(app.get('register')).post(api.create)
  app.route('/v1/register-v2').post(api.createV2)
}
