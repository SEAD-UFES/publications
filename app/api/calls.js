/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const api = {}
  const error = app.errors.calls
  const {
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validate, validatePermission } = require('../validators/calls.js')
  const { isEmpty } = require('lodash')

  api.create = async (req, res) => {
    let errors
    try {
      errors = await validate(req, models)
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
      errors = await validate(req, models)
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

  return api
}
