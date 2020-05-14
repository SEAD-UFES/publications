/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.calendars
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validateBody, validatePermission } = require('../validators/calendar')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filterVisibleByCallId, filterVisibleByCallIds } = require('../helpers/selectiveProcessHelpers')

  //Calendar create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('calendar-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, null)
      if (permissionErrors) {
        return res.status(401).json(error.parse('calendar-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.Calendar.create(req.body)
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  //Calendar read
  api.read = async (req, res) => {
    try {
      const toRead = await models.Calendar.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('calendar-400', idNotFoundDevMessage()))
      }

      //checar visibilidade do processo
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const visibleCallId = await filterVisibleByCallId(toRead.call_id, user, models)
      if (!visibleCallId) {
        return res.status(400).json(error.parse('calendar-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  //Calendar update
  api.update = async (req, res) => {
    try {
      const toUpdate = await models.Calendar.findByPk(req.params.id)

      //verify valid id
      if (!toUpdate) {
        return res.status(400).json(error.parse('calendar-400', idNotFoundDevMessage()))
      }

      //validation
      const validationErrors = await validateBody(req.body, models, 'update')
      if (validationErrors) {
        return res.status(400).json(error.parse('calendar-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, toUpdate)
      if (permissionErrors) {
        return res.status(401).json(error.parse('calendar-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.Calendar.create(req.body)
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  //Calendar delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Calendar.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('calendar-400', idNotFoundDevMessage()))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('calendar-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.Calendar.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('calendar-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  api.list = async (req, res) => {
    const callIds = req.query.call_ids ? req.query.call_ids : []
    try {
      //validation
      if (callIds.length === 0) {
        const errors = { message: 'Array de pesquisa (call_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('calendar-400', validationDevMessage(errors)))
      }

      //checar visibilidade dos processos (e remover não autorizados da pesquisa)
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const filtredCallIds = await filterVisibleByCallIds(callIds, user, models)

      //query and send
      const whereCallIds = filtredCallIds.length > 0 ? { call_id: filtredCallIds } : { call_id: null }
      const calendars = await models.Calendar.findAll({ where: { ...whereCallIds } })
      return res.json(calendars)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  return api
}
