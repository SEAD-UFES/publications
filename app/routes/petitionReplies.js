/** @format */

module.exports = app => {
  const api = app.api.petitionReplies
  const authApi = app.api.auth

  app.route(app.get('petitionReplyApiRoute')).post(authApi.authenticationRequired, api.create)
  //.get(api.list)

  app.route(app.get('petitionReplyApiRoute') + '/:id').get(authApi.authenticationRequired, api.read)
  //.put(authApi.authenticationRequired, api.update)
  //.delete(authApi.authenticationRequired, api.delete)
}
