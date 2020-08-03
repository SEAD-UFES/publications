/** @format */

const { findUserByToken } = require('../helpers/userHelpers')

module.exports = app => {
  const api = {}
  const models = require('../models')
  const error = app.errors.calls
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validate, validatePermission } = require('../validators/calls.js')
  const { isEmpty } = require('lodash')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filterVisibleByProcessId, filterVisibleByProcessIds } = require('../helpers/selectiveProcessHelpers')

  //Call create
  api.create = async (req, res) => {
    try {
      //validation
      const errors = await validate(req, models)
      if (!isEmpty(errors)) {
        return res.status(400).json(error.parse('call-400', validationDevMessage(errors)))
      }

      //try to create
      const created = await models.Call.create(req.body)
      await created.reload() //to format dates and model correctly
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('call-500', unknownDevMessage(err)))
    }
  }

  //Call read
  api.specific = async (req, res) => {
    const assignmentInclude = { model: models.Assignment, required: false }

    const regionInclude = { model: models.Region, required: false }

    const restrictionInclude = { model: models.Restriction, required: false }

    const vacancyInclude = {
      model: models.Vacancy,
      required: false,
      include: [assignmentInclude, regionInclude, restrictionInclude]
    }

    const callInclude = { include: [vacancyInclude], order: [[models.Vacancy, 'createdAt', 'ASC']] }

    try {
      const toRead = await models.Call.findByPk(req.params.id, callInclude)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('call-400', idNotFoundDevMessage()))
      }

      //checar visibilidade da chamada
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const visibleProcessId = await filterVisibleByProcessId(toRead.selectiveProcess_id, user, models)
      if (!visibleProcessId) {
        return res.status(400).json(error.parse('call-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('call-500', unknownDevMessage(err)))
    }
  }

  api.update = async (req, res) => {
    try {
      const toUpdate = await models.Call.findByPk(req.params.id)

      //verify valid id
      if (!toUpdate) {
        return res.status(400).json(error.parse('call-400', idNotFoundDevMessage()))
      }

      //validation
      const errors = await validate(req, models)
      if (!isEmpty(errors)) {
        return res.status(400).json(error.parse('call-400', validationDevMessage(errors)))
      }

      //try to update
      const updated = await toUpdate.update(req.body, { fields: Object.keys(req.body) })
      await updated.reload() //to format dates and model correctly
      return res.status(201).json(updated)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('call-500', unknownDevMessage(err)))
    }
  }

  //Call delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Call.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('call-400', idNotFoundDevMessage()))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('call-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.Call.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('call-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('call-500', unknownDevMessage(err)))
    }
  }

  //Call List
  api.list = async (req, res) => {
    const selectiveProcessIds = req.query.selectiveProcess_ids ? req.query.selectiveProcess_ids : []
    try {
      //validation
      if (selectiveProcessIds.length === 0) {
        const errors = { message: 'Array de pesquisa (selectiveProcess_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('call-400', validationDevMessage(errors)))
      }

      //checar visibilidade dos processos (e remover não autorizados da pesquisa)
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const filtredSelectiveProcessIds = await filterVisibleByProcessIds(selectiveProcessIds, user, models)

      const whereSelectiveProcessIds =
        filtredSelectiveProcessIds.length > 0
          ? { selectiveProcess_id: filtredSelectiveProcessIds }
          : { selectiveProcess_id: null }
      const processes = await models.Call.findAll({ where: { ...whereSelectiveProcessIds } })
      return res.json(processes)
    } catch (err) {
      return res.status(500).json(error.parse('call-500', unknownDevMessage(err)))
    }
  }

  return api
}
