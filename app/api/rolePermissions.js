/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.rolePermissions
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (
      !(Object.prototype.toString.call(req.body) === '[object Object]') ||
      !req.body.roleType_id ||
      !req.body.permission_id
    ) {
      res.status(400).json(error.parse('rolePermissions-01', {}))
    } else {
      models.RolePermission.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('rolePermissions-02', e))
        }
      )
    }
  }

  api.read = (req, res) => {
    models.RolePermission.findById(req.params.id, {
      include: [
        {
          model: models.RoleType,
          required: false
        },
        {
          model: models.Permission,
          required: false
        }
      ]
    }).then(
      rolePermission => {
        res.json(rolePermission)
      },
      e => {
        res.status(500).json(error.parse('rolePermissions-02', e))
      }
    )
  }

  // RolePermission delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.RolePermission.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('rolePermission-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.RolePermission.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('rolePermission-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('rolePermission-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.RolePermission.findAll({}).then(
      rolePermissions => {
        res.json(rolePermissions)
      },
      e => {
        res.status(500).json(error.parse('rolePermissions-02', e))
      }
    )
  }

  return api
}
