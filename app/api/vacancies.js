/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.vacancies
  const { validationDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.qtd || !req.body.reserve) {
      res.status(400).json(error.parse('vacancies-01', {}))
    } else {
      models.Vacancy.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('vacancies-02', e))
        }
      )
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
