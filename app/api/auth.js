/** @format */

module.exports = app => {
  const models = require('../models')
  const jwt = require('jsonwebtoken')
  const api = {}
  const error = app.errors.auth

  const { isAdmin, hasGlobalPermission, allowedCourseIds } = require('../helpers/permissionCheck')
  const { getPermission } = require('../helpers/permissionInfo')
  const { getCourseId } = require('../helpers/courseInfo')

  const { validateBody } = require('../validators/auth')
  const cryptoRandomString = require('crypto-random-string')
  const { sendMailPromise, sendMail } = require('../helpers/nodemailer')

  const userInclude = {
    include: [
      {
        model: models.UserRole,
        required: false,
        attributes: {
          exclude: ['roleType_id', 'user_id', 'course_id']
        },
        include: [
          {
            model: models.RoleType,
            required: false,
            include: [
              {
                model: models.Permission,
                required: false
              }
            ]
          },
          {
            model: models.Course,
            required: false
          }
        ]
      },
      {
        model: models.Person,
        require: false
      }
    ]
  }

  api.authenticate = (req, res) => {
    if (req.body && req.body.login && req.body.password) {
      models.User.findOne({ where: { login: req.body.login } }).then(
        user => {
          if (!user) {
            res.status(401).json(error.parse('auth-04', 'This login was not found.'))
          } else if (!user.authorized) {
            res.status(401).json(error.parse('auth-09', new Error('User is unauthorized')))
          } else {
            user.validPassword(req.body.password).then(valid => {
              if (valid) {
                let access_token = jwt.sign({ data: user.id }, app.get('jwt_secret'), { expiresIn: '6h' })
                res.json({ access_token, userMessage: 'Authentication success' })
              } else {
                res.status(401).json(error.parse('auth-05', 'Wrong user or password.'))
              }
            })
          }
        },
        e => res.status(500).json(error.parse('auth-06', 'Internal server error.'))
      )
    } else {
      res.status(400).json(error.parse('auth-03', 'The request must provide a login and password.'))
    }
  }

  api.authenticationRequired = (req, res, next) => {
    try {
      const decoded = jwt.verify(req.headers['x-access-token'], app.get('jwt_secret'))
      models.User.findById(decoded.data, userInclude).then(
        user => {
          req.user = user
          next()
        },
        e => {
          res.status(500).json(error.parse('auth-03', e))
        }
      )
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          res.status(401).json(error.parse('auth-01', e))
          break
        case 'JsonWebTokenError':
          res.status(401).json(error.parse('auth-02', e))
          break
        default:
          res.status(401).json(error.parse('auth-07', e))
      }
    }
  }

  api.adminRequired = (req, res, next) => {
    if (isAdmin(req.user)) next()
    else res.status(401).json(error.parse('auth-08', 'Administrator level required'))
  }

  api.globalPermissionRequired = (req, res, next) => {
    if (isAdmin(req.user)) return next()

    const neededPermission = getPermission({ url: req.url, method: req.method })
    const globalPermission = hasGlobalPermission(req.user, neededPermission)

    if (globalPermission) return next()

    return res.status(401).json(error.parse('auth-08', 'Global permission level required'))
  }

  api.checkAccessLevel = async (req, res, next) => {
    if (isAdmin(req.user)) return next()

    const neededPermission = getPermission({ url: req.url, method: req.method })
    const globalPermission = hasGlobalPermission(req.user, neededPermission)

    if (globalPermission) return next()

    try {
      //Tem permissão no curso em que se está tentando a operação
      const neededCourseId = await getCourseId(req)

      const allowedCourseList = allowedCourseIds(req.user, neededPermission)
      const onCoursePermission = allowedCourseList.includes(neededCourseId)

      if (onCoursePermission) return next()
    } catch (e) {
      return res.status(401).json(error.parse('auth-10', new Error('This user has no associated courses')))
    }

    res.status(401).json(error.parse('auth-10', new Error("You don't have permission to require this operation")))
  }

  //revover password require
  api.recoverRequire = async (req, res) => {
    //Conferir se tem um body valido
    const validation = validateBody(req.body)
    if (!validation.isValid) {
      return res.status(400).json(error.parse('auth-09', new Error('Bad request')))
    }

    //Conferir se o usuário existe e é valido
    let includes = [{ model: models.Person, required: false }]
    let user = await models.User.findOne({ include: includes, where: { login: req.body.login, authorized: true } })
    if (user === null) {
      return res.status(400).json(error.parse('auth-09', new Error('User: Inactive, Not valid, Not exist')))
    }

    //Se tudo ok, gerar e enviar token
    const token = cryptoRandomString({ length: 52 }) + '0' + Date.now().toString(16)
    const passwordRecover = await models.PasswordRecover.create({ user_id: user.id, token: token })

    const html = `
    <h1>Requisição de troca de senha</h1>
    <p>Olá ${user.Person ? user.Person.name : user.login}</p>
    <p>Você nos disse que esqueceu sua senha. Se você realmente esqueceu, utilize o link abaixo para redefini-la.</p>
    <p>
      Para redefinir sua senha,
      <a href="http://localhost:3000/recovery/${
        passwordRecover.token
      }" target="_blank" rel="noopener noreferrer">clique aqui</a>
    </p>
    <p>Este e-mail é automático, favor não responder!</p>
    `

    mailOptions = {
      from: '1e3a18137a-8f25af@inbox.mailtrap.io',
      to: user.login,
      subject: 'SPS SEAD - Requisição de troca de senha.',
      html: html
    }

    sendMail(mailOptions)
      .then(info => {
        console.log(`Email enviado para ${user.login} - `, info.response)
        return res.json({ message: `Email enviado para ${user.login}` })
      })
      .catch(error => {
        console.log(error)
        return res.status(400).json(error.parse('auth-09', new Error('Falha ao enviar email')))
      })
  }

  //recover password change
  api.recoverChange = (req, res, next) => {
    return res.json({ result: 'route password change working' })
  }

  return api
}
