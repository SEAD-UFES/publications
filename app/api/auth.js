module.exports = app => {
  const models = require('../models')
  const jwt = require('jsonwebtoken')
  const api = {}
  const error = app.errors.auth
  const { bodyRoute, paramRoute } = require('../helpers/courseInfo')
  const { getPermission } = require('../helpers/permissionInfo')
  const { isAdmin, hasGlobalPermission } = require('../helpers/permissionCheck')

  api.authenticate = (req, res) => {
    if (
      Array.isArray(req.body) ||
      (req.body.constructor === Object && Object.keys(req.body).length === 0) ||
      !req.body.login ||
      !req.body.password
    )
      res
        .status(400)
        .json(
          error.parse(
            'auth-03',
            new Error('This resource spect a JSON user object in the body request containing username and password.')
          )
        )
    else {
      models.User.findOne({ where: { login: req.body.login } }).then(
        user => {
          if (!user) {
            res.status(401).json(error.parse('auth-04', new Error('This login was not found.')))
          } else if (!user.authorized) res.status(401).json(error.parse('auth-09', new Error('User is unauthorized')))
          else
            user.validPassword(req.body.password).then(valid => {
              if (valid) {
                let access_token = jwt.sign({ data: user.id }, app.get('jwt_secret'), { expiresIn: '6h' })
                res.json({ access_token, userMessage: 'Authentication success' })
              } else {
                res.status(401).json(error.parse('auth-05', new Error('Wrong password.')))
              }
            })
        },
        e => res.status(500).json(error.parse('auth-06', new Error('Internal server error.')))
      )
    }
  }

  api.authenticationRequired = (req, res, next) => {
    try {
      decoded = jwt.verify(req.headers['x-access-token'], app.get('jwt_secret'))
      models.User.findById(decoded.data, {
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
          }
        ]
      }).then(
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
    if (req.user.UserRoles.some(o => o.RoleType.name == 'Administrador')) next()
    else res.status(401).json(error.parse('auth-08', new Error('Administrator level required')))
  }

  api.checkAccessLevel = (req, res, next) => {
    function callBack(finded) {
      if (finded) next()
      else
        res.status(401).json(error.parse('auth-10', new Error("You don't have permission to require this operation")))
    }

    let processed = 0
    let finded = false
    if (req.user.UserRoles.length === 0) callBack(false)
    else if (req.user.UserRoles.some(o => o.RoleType.name == 'Administrador')) next()
    else
      req.user.UserRoles.forEach((role, i, arr) => {
        models.RolePermission.findAll({
          where: {
            roleType_id: role.RoleType.id
          },
          include: [
            {
              model: models.Permission,
              required: false,
              include: [
                {
                  model: models.Action,
                  required: false,
                  attributes: ['name']
                },
                {
                  model: models.Target,
                  required: false,
                  attributes: ['name', 'urn']
                }
              ],
              attributes: ['action_id', 'target_id']
            }
          ],
          attributes: ['permission_id']
        }).then(rolePermissions => {
          processed++
          console.log(req.route.path)
          if (
            rolePermissions.some(
              rp =>
                rp.Permission.Action.name == req.method &&
                (rp.Permission.Target.urn == req.originalUrl || rp.Permission.Target.urn == req.route.path)
            )
          ) {
            finded = true
          }
          if (processed === arr.length)
            if (finded) callBack(true)
            else callBack(false)
          else if (finded) callBack(true)
        })
      })
  }

  api.checkCourseStaff = async (req, res, next) => {
    if (req.user.UserRoles && req.user.UserRoles.length === 0) {
      res.status(500).json(error.parse('auth-11', 'This user has no UserRoles.'))
    } else {
      const Admin = isAdmin(req.user)
      const needed_permission = getPermission({ url: req.url, method: req.method })
      const GlobalPermission = hasGlobalPermission(req.user, needed_permission)

      //É administrador
      if (Admin) {
        next()
      }

      //Tem papel global com as permissão
      else if (GlobalPermission) {
        next()
      }

      // outros casos
      else {
        let allowedCourse
        let targetCourse

        if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'PUT') {
          try {
            targetCourse = await paramRoute(req.url)
          } catch (e) {
            res.status(500).json(error.parse('auth-11', e))
          }
        } else if (req.body.course_id || req.query.course_id) {
          targetCourse = req.body.course_id ? req.body.course_id : req.query.course_id
        } else {
          try {
            targetCourse = req.body ? await bodyRoute(req.body) : await bodyRoute(req.query)
          } catch (e) {
            res.status(500).json(error.parse('auth-11', e))
          }
        }

        if (targetCourse) {
          allowedCourse = req.user.UserRoles.filter(x => x.Course)
            .map(x => x.Course.id)
            .includes(targetCourse)

          if (allowedCourse) {
            next()
          } else {
            res
              .status(500)
              .json(error.parse('auth-11', 'This user does not have the required permissions to access this resource.'))
          }
        }
      }
    }
  }

  return api
}
