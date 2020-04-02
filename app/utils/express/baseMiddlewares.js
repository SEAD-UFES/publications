const helmet = require('helmet')
const bodyParser = require('body-parser')
var cors = require('cors')

module.exports = app => {
  const corsOptions = {
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
    methods: '*'
  }

  const invalidRequestMiddleware = () => (err, req, res, next) => {
    const error400Message = err => ({
      code: 'request-400',
      userMessage: `Requisição inválida.`,
      devMessage: {
        name: 'RequestError',
        original: err.message,
        errors: {
          request: `Requisição inválida.`
        }
      }
    })

    if (err) {
      return res.status(400).json(error400Message(err))
    } else {
      return next()
    }
  }

  app.set('json spaces', 4)
  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(invalidRequestMiddleware())
}
