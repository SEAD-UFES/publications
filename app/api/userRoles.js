/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.roles
  const { idNotFoundDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (
      !(Object.prototype.toString.call(req.body) === '[object Object]') ||
      !req.body.roleType_id ||
      !req.body.user_id
    ) {
      res.status(400).json(error.parse('roles-01', {}))
    } else {
      models.UserRole.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('userRoles-02', e))
        }
      )
    }
  }

  api.list = (req, res) => {
    models.UserRole.findAll({
      include: [
        { model: models.User, attributes: { exclude: ['password'] } },
        { model: models.RoleType },
        { model: models.Course, required: false }
      ],
      attributes: { exclude: ['User.password'] }
    }).then(
      roles => {
        res.json(roles)
      },
      e => {
        res.status(500).json(error.parse('userRoles-02', e))
      }
    )
  }

  api.specific = (req, res) => {
    models.UserRole.findOne({
      where: { id: req.params.id },
      include: [
        { model: models.User, attributes: { exclude: ['password'] } },
        { model: models.RoleType },
        { model: models.Course, required: false }
      ]
    }).then(
      userRole => {
        res.json(userRole)
      },
      e => {
        res.status(500).json(error.parse('userRoles-02', e))
      }
    )
  }

  api.delete = async (req, res) => {
    const toDelete = await models.UserRole.findByPk(req.params.id)

    //verify valid id
    if (!toDelete) {
      return res.status(400).json(error.parse('userRole-400', idNotFoundDevMessage()))
    }

    //try to delete
    try {
      await models.UserRole.destroy({ where: { id: req.params.id }, individualHooks: true }).then(_ =>
        res.sendStatus(204)
      )
    } catch (e) {
      if (e.name === 'ForbbidenDeletionError') return res.status(403).json(error.parse('userRole-403', e))
      return res.status(500).json(error.parse('userRole-500', e))
    }
  }

  return api
}
