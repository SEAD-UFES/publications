/** @format */

module.exports = app => {
  const api = app.api.petitionReplies
  const authApi = app.api.auth
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app
    .route(baseFolder + app.get('petitionReplyApiRoute'))
    .post(authApi.authenticationRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app.route(baseFolder + app.get('petitionReplyApiRoute') + '/:id').get(authApi.authenticationRequired, api.read)
  //.put(authApi.authenticationRequired, api.update)
  //.delete(authApi.authenticationRequired, api.delete)
}
