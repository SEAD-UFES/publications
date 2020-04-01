// const http = require('http')
// const app = require('./config/express')

// http.createServer(app).listen(app.get('port'), () => {
//   console.log('Server running at port ' + app.get('port'))
// })

const express = require('express')
const consign = require('consign')

const secrets = require('./config/secrets.json')
const apiRoutes = require('./config/apiRoutes.json')
const siteConf = require('./config/site.js')

const app = express()

//Load Secrets File.
secrets.forEach(s => {
  app.set(s.key, s.value)
})
//Load API Routes file
apiRoutes.forEach(r => {
  app.set(r.key, r.value)
})
//set port
app.set('port', process.env.PORT || siteConf.port || 3000)

consign({ cwd: 'app', locale: 'pt-br' })
  .include('helpers')
  .then('errors')
  .then('models/index.js')
  .then('api')
  .then('utils/express/baseMiddlewares.js')
  .then('routes')
  .then('utils/express/notFoundMiddleware.js')
  .then('utils/express/boot.js')
  .into(app)
