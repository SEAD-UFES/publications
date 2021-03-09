/** @format */

module.exports = app => {
  const api = app.api.register
  const siteConf = require('../../config/site')

  //create base folder
  const baseFolder = siteConf.backend_base_subfolder ? siteConf.backend_base_subfolder : ''

  app.route(baseFolder + app.get('register')).post(api.createV2)
}
