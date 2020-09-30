/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.actions
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.name || !req.body.description) {
      res.status(400).json(error.parse('actions-01', {}))
    } else {
      models.Action.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('actions-02', e))
        }
      )
    }
  }

  api.update = (req, res) => {
    models.Action.findById(req.params.id).then(action => {
      if (!action) res.status(500).json(error.parse('actions-02', {}))
      else
        action.update(req.body, { fields: Object.keys(req.body) }).then(
          updated => res.json(updated),
          e => res.status(500).json(error.parse('actions-02', e))
        )
    })
  }

  //Action delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Action.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('action-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Action.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('action-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('action-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.Action.findAll({}).then(
      actions => {
        res.json(actions)
      },
      e => {
        res.status(500).json(error.parse('actions-02', e))
      }
    )
  }

  return api
}
