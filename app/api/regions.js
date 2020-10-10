/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.regions
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.name || !req.body.description) {
      res.status(400).json(error.parse('regions-01', {}))
    } else {
      models.Region.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('regions-02', e))
        }
      )
    }
  }

  api.read = async (req, res) => {
    try {
      const toRead = await models.Region.findByPk(req.params.id)

      //check if exists
      if (!toRead) return res.status(400).json(error.parse('regions-03', {}))

      //return result
      return res.json(toRead)
    } catch (error) {
      return res.status(500).json(error.parse('regions-02', error))
    }
  }

  api.update = (req, res) => {
    models.Region.findById(req.params.id).then(
      region => {
        if (!region) res.status(400).json(error.parse('regions-03', {}))
        else
          region.update(req.body, { fields: Object.keys(req.body) }).then(
            updated => res.json(updated),
            e => res.status(500).json(error.parse('regions-02', e))
          )
      },
      e => res.status(500).json(error.parse('regions-02', e))
    )
  }

  //Region delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Region.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('region-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Region.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('region-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('region-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.Region.findAll({}).then(
      regions => {
        res.json(regions)
      },
      e => {
        res.status(500).json(error.parse('regions-02', e))
      }
    )
  }

  return api
}
