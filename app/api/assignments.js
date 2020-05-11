/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.assignments

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.name || !req.body.description) {
      res.status(400).json(error.parse('assignments-01', {}))
    } else {
      models.Assignment.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('assignments-02', e))
        }
      )
    }
  }

  api.read = async (req, res) => {
    try {
      const toRead = await models.Assignment.findByPk(req.params.id)

      //check if exists
      if (!toRead) return res.status(400).json(error.parse('assignments-02', {}))

      //return result
      return res.json(toRead)
    } catch (error) {
      return res.status(500).json(error.parse('assignments-02', error))
    }
  }

  api.update = (req, res) => {
    models.Assignment.findById(req.params.id).then(assignment => {
      if (!assignment) res.status(500).json(error.parse('assignments-02', {}))
      else
        assignment.update(req.body, { fields: Object.keys(req.body) }).then(
          updated => res.json(updated),
          e => res.status(500).json(error.parse('assignments-02', e))
        )
    })
  }

  api.delete = (req, res) => {
    models.Assignment.destroy({ where: { id: req.params.id } }).then(
      _ => res.sendStatus(204),
      e => res.status(500).json(error.parse('assignments-02', e))
    )
  }

  api.list = (req, res) => {
    models.Assignment.findAll({}).then(
      assignments => {
        res.json(assignments)
      },
      e => {
        res.status(500).json(error.parse('assignments-02', e))
      }
    )
  }

  return api
}
