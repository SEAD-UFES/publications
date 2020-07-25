/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.vacancies
  const { validationDevMessage, unknownDevMessage } = require('../helpers/error')
  const { validateBody } = require('../validators/vacancy')

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

  api.specific = (req, res) => {
    const includeRegion = { model: models.Region, required: false }
    const includeAssignment = { model: models.Assignment, required: false }
    const includeRestriction = { model: models.Restriction, required: false }
    const includeCourse = { model: models.Course, required: false }
    const includeProcess = { model: models.SelectiveProcess, required: false, include: [includeCourse] }
    const includeCall = { model: models.Call, required: false, include: [includeProcess] }

    models.Vacancy.findById(req.params.id, {
      include: [includeCall, includeRegion, includeAssignment, includeRestriction]
    }).then(
      vacancy => {
        res.json(vacancy)
      },
      e => {
        res.status(500).json(error.parse('vacancies-02', e))
      }
    )
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

  api.delete = (req, res) => {
    models.Vacancy.destroy({ where: { id: req.params.id } }).then(
      _ => res.sendStatus(204),
      e => res.status(500).json(error.parse('vacancies-02', e))
    )
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
