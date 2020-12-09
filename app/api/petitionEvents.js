/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.petitionEvents

  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const {
    validateBody,
    validatePermissionCreate,
    validatePermissionUpdate,
    validatePermissionDelete
  } = require('../validators/petitionevent.js')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filterVisibleByCalendarId, filterVisibleByCalendarIds } = require('../helpers/selectiveProcessHelpers')

  //PetitionEvent create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('petitionEvent-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermissionCreate(req, models)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petitionEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.PetitionEvent.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionEvent-500', unknownDevMessage(err)))
    }
  }

  //PettionEvent read
  api.read = async (req, res) => {
    try {
      const toRead = await models.PetitionEvent.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('petitionEvent-400', idNotFoundDevMessage()))
      }

      //checar visibilidade do processo
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const visibleCalendarId = await filterVisibleByCalendarId(toRead.calendar_id, user, models)
      if (!visibleCalendarId) {
        return res.status(400).json(error.parse('petitionEvent-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionEvent-500', unknownDevMessage(err)))
    }
  }

  //PetitionEvent update
  api.update = async (req, res) => {
    try {
      const toUpdate = await models.PetitionEvent.findByPk(req.params.id)

      //verify valid id
      if (!toUpdate) {
        return res.status(400).json(error.parse('petitionEvent-400', idNotFoundDevMessage()))
      }

      //validation
      const validationErrors = await validateBody(req.body, models, 'update', toUpdate)
      if (validationErrors) {
        return res.status(400).json(error.parse('petitionEvent-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermissionUpdate(req, models, toUpdate)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petitionEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to update
      const updated = await toUpdate.update(req.body)
      await updated.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(updated)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionEvent-500', unknownDevMessage(err)))
    }
  }

  //PetitionEvent delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.PetitionEvent.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('petitionEvent-400', idNotFoundDevMessage()))
      }

      //permission
      const permissionErrors = await validatePermissionDelete(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petitionEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.PetitionEvent.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('petitionEvent-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('petitionEvent-500', unknownDevMessage(err)))
    }
  }

  //PetitionEvent list
  api.list = async (req, res) => {
    const call_id = req.query.call_id ? req.query.call_id : null
    const calendarIds = req.query.calendar_ids ? req.query.calendar_ids : []

    try {
      //validation
      if (calendarIds.length === 0 && call_id === null) {
        const errors = { message: 'Array de pesquisa (calendar_ids) ou call_id deve ser enviado.' }
        return res.status(400).json(error.parse('petition-400', validationDevMessage(errors)))
      }

      //extraindo as calendarIds a partir de call_id
      let callCalendarIds = []
      if (call_id) {
        const calendars = await models.Calendar.findAll({ where: { call_id: call_id } })
        callCalendarIds = calendars.map(cld => cld.id)
      }

      //Decidindo o set de calendarIds que será usado
      const newCalendarIds = call_id
        ? calendarIds.length === 0
          ? callCalendarIds
          : callCalendarIds.filter(id => calendarIds.includes(id))
        : calendarIds

      //checar visibilidade dos processos (e remover não autorizados da pesquisa)
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      console.log('user:', typeof user)
      const filtredCldIds = await filterVisibleByCalendarIds(newCalendarIds, user, models)

      //query and send
      const whereCalendarIds = filtredCldIds.length > 0 ? { calendar_id: filtredCldIds } : { calendar_id: null }
      const PEs = await models.PetitionEvent.findAll({ where: { ...whereCalendarIds } })
      return res.json(PEs)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  return api
}
