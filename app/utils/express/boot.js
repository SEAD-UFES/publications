const configSite = require('../../../config/site')

module.exports = app => {
  const port = process.env.PORT || configSite.port || 3000

  app.listen(port, () => {
    console.log('Server running! at port: ' + port)
  })
}
