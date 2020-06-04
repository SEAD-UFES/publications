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
    models.Vacancy.findById(req.params.id, {
      include: [
        {
          model: models.Call,
          required: false,
          include: [
            {
              model: models.SelectiveProcess,
              required: false,
              include: [
                {
                  model: models.Course,
                  required: false
                }
              ]
            }
          ]
        },
        {
          model: models.Region,
          required: false
        },
        {
          model: models.Assignment,
          required: false
        },
        {
          model: models.Restriction,
          required: false
        }
      ]
    }).then(
      vacancy => {
        res.json(vacancy)
      },
      e => {
        res.status(500).json(error.parse('vacancies-02', e))
      }
    )
  }

  api.update = async (req, res) => {

    try {
      const errors = await validateBody(req.body, models, 'update', req.params.id)
      if (errors) {
        return res.status(400).json(error.parse('vacancy-400', validationDevMessage(errors)))
      }

      const vacancy = await models.Vacancy.findByPk(req.params.id)
      const updated = await vacancy.update(req.body)

      return res.json(updated)
    } catch (err) {
      return res.status(500).json(error.parse('vacancy-500', unknownDevMessage(err)))
    } 

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
