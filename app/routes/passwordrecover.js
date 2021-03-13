/** @format */

module.exports = app => {
  const api = app.api.passwordrecover
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  //post login to recover pass. Send a token to user via email. Return status message
  app.route(`${baseFolder}${app.get('recoverApiRoute')}`).post(api.recoverRequire)

  //post new password to the user. Return status message
  app
    .route(`${baseFolder}${app.get('recoverApiRoute')}/:token`)
    .get(api.recoverGet)
    .post(api.recoverChange)
}
