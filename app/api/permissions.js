/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.permissions
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (
      !(Object.prototype.toString.call(req.body) === '[object Object]') ||
      !req.body.target_id ||
      !req.body.action_id
    ) {
      res.status(400).json(error.parse('permissions-01', {}))
    } else {
      models.Permission.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('permissions-02', e))
        }
      )
    }
  }

  //Permission delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Permission.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('permission-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Permission.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('permission-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('permission-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.Permission.findAll({}).then(
      permissions => {
        res.json(permissions)
      },
      e => {
        res.status(500).json(error.parse('permissions-02', e))
      }
    )
  }

  return api
}
