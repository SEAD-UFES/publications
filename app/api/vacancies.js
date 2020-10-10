/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.vacancies
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage
  } = require('../helpers/error')
  const { validateBody, validatePermission } = require('../validators/vacancy')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filterVisibleByCallId } = require('../helpers/selectiveProcessHelpers')

  //Vacancy create
  api.create = async (req, res) => {
    try {
      //validation
      const errors = await validateBody(req.body, models, 'create')
      if (errors) {
        return res.status(400).json(error.parse('vacancy-400', validationDevMessage(errors)))
      }

      //try to create
      const created = await models.Vacancy.create(req.body)
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('vacancy-500', unknownDevMessage(err)))
    }
  }

  api.read = async (req, res) => {
    const includeRegion = { model: models.Region, required: false }
    const includeAssignment = { model: models.Assignment, required: false }
    const includeRestriction = { model: models.Restriction, required: false }
    const includeCourse = { model: models.Course, required: false }
    const includeProcess = { model: models.SelectiveProcess, required: false, include: [includeCourse] }
    const includeCall = { model: models.Call, required: false, include: [includeProcess] }

    try {
      const toRead = await models.Vacancy.findByPk(req.params.id, {
        include: [includeCall, includeRegion, includeAssignment, includeRestriction]
      })

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('vacancy-400', idNotFoundDevMessage()))
      }

      //validar visibilidade/acesso a vacancy
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const visibleCallId = filterVisibleByCallId(toRead.call_id, user, models)
      if (!visibleCallId) {
        return res.status(400).json(error.parse('vacancy-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('vacancy-500', unknownDevMessage(err)))
    }
  }

  api.update = (req, res) => {
    models.Vacancy.findById(req.params.id).then(vacancy => {
      if (!vacancy) res.status(400).json(error.parse('vacancies-03', {}))
      else
        vacancy.update(req.body).then(
          updatedVacancy => {
            res.json(updatedVacancy)
          },
          e => res.status(500).json(error.parse('vacancies-02', e))
        )
    })
  }

  //Vacancy delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Vacancy.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('vacancy-400', idNotFoundDevMessage()))
      }

      //check permission
      const permissionErrors = await validatePermission(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('vacancy-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.Vacancy.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('vacancy-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('vacancy-500', unknownDevMessage(err)))
    }
  }

  api.list = async (req, res) => {
    const callIds = req.query.call_ids ? req.query.call_ids : []
    try {
      //validation
      if (callIds.length === 0) {
        const errors = { message: 'Array de pesquisa (call_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('vacancy-400', validationDevMessage(errors)))
      }

      //query and send
      const whereCallIds = callIds.length > 0 ? { call_id: callIds } : {}
      const vacancies = await models.Vacancy.findAll({ where: { ...whereCallIds } })
      return res.json(vacancies)
    } catch (e) {
      return res.status(500).json(error.parse('vacancy-500', e))
    }
  }

  return api
}
