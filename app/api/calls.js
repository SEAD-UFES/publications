/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const api = {}
  const error = app.errors.calls
  const { validate } = require('../validators/calls.js')
  const { isEmpty } = require('lodash')

  api.create = async (req, res) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(400).json(error.parse('calls-02', 'Error during validation.'))
    }

    if (isEmpty(errors)) {
      try {
        const createdCall = await models.Call.create(req.body)

        res.status(201).json({ id: createdCall.id })
      } catch (e) {
        res.status(400).json(error.parse('calls-05', 'Error trying to create new Call.'))
      }
    } else {
      /* fail, send validation errors */
      res.status(400).json(error.parse('calls-01', { errors }))
    }
  }

  api.specific = (req, res) => {
    const vacancy_structure = {
      model: models.Vacancy,
      required: false,
      include: [
        {
          model: models.Assignment,
          required: false
        },
        {
          model: models.Restriction,
          required: false
        },
        {
          model: models.Region,
          required: false
        }
      ]
    }

    const call_structure = {
      include: [vacancy_structure],
      order: [[models.Vacancy, 'createdAt', 'ASC']]
    }

    //Find and return call
    models.Call.findById(req.params.id, call_structure).then(
      call => {
        res.json(call)
      },
      e => {
        res.status(500).json(error.parse('calls-02', e))
      }
    )
  }

  api.update = async (req, res) => {
    let errors

    try {
      errors = await validate(req)
    } catch (e) {
      res.status(500).json(error.parse('calls-02', e))
    }

    if (isEmpty(errors)) {
      try {
        const call = await models.Call.findById(req.params.id)
        const updatedCall = await call.update(req.body, { fields: Object.keys(req.body) })

        res.json(updatedCall)
      } catch (e) {
        res.status(500).json(error.parse('calls-02', 'Error updating call.'))
      }
    } else {
      res.status(400).json(error.parse('calls-01', { errors }))
    }
  }

  api.delete = (req, res) => {
    models.Call.destroy({ where: { id: req.params.id } }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('calls-04'))
      }
    )
  }

  return api
}
