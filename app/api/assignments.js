/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.assignments
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validateBody } = require('../validators/assignment')

  api.create = async (req, res) => {
    try {
      //validation and rules
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('assignment-400', validationDevMessage(validationErrors)))
      }

      //permission
      // uses auth required middleware
      // uses admin required middleware

      //try to create
      const created = await models.Assignment.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('assignment-500', unknownDevMessage(err)))
    }
  }

  api.read = async (req, res) => {
    try {
      const toRead = await models.Assignment.findByPk(req.params.id)

      //check if exists
      if (!toRead) return res.status(400).json(error.parse('assignments-400', {}))

      //return result
      return res.json(toRead)

      //if error
    } catch (error) {
      return res.status(500).json(error.parse('assignment-500', error))
    }
  }

  api.update = async (req, res) => {
    try {
      const toUpdate = await models.Assignment.findByPk(req.params.id)

      //verify valid id
      if (!toUpdate) {
        return res.status(400).json(error.parse('assignment-400', idNotFoundDevMessage()))
      }

      //validation and rules
      const validationErrors = await validateBody(req.body, models, 'update', toUpdate)
      if (validationErrors) {
        return res.status(400).json(error.parse('assignment-400', validationDevMessage(validationErrors)))
      }

      //permission
      // uses auth required middleware
      // uses admin required middleware

      //try to update
      const updated = await toUpdate.update(req.body)
      await updated.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(updated)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('assignment-500', unknownDevMessage(err)))
    }
  }

  //Assignment delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Assignment.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('assignment-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Assignment.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('assignment-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('assignment-500', unknownDevMessage(err)))
    }
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
