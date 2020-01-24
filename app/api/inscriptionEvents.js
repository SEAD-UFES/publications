/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.inscriptionEvents
  const { validate } = require('../validators/inscriptionevents.js')
  const { isEmpty } = require('../helpers/is-empty.js')

  api.create = async (req, res) => {
    // should validate input before trying to create
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(400).json(error.parse('inscriptionEvents-02', 'Error during validation'))
    }

    if (isEmpty(errors)) {
      try {
        const createdInscriptionEvent = await models.InscriptionEvent.create(req.body)
        res.status(201).json(createdInscriptionEvent)
      } catch (e) {
        res.status(400).json(error.parse('inscriptionEvents-02', 'Error trying to create new Inscription Event.'))
      }
    } else {
      res.status(400).json(error.parse('inscriptionEvents-02', { errors }))
    }
  }

  api.specific = async (req, res) => {
    try {
      const inscriptionEvent = await models.InscriptionEvent.findById(req.params.id)

      if (inscriptionEvent) {
        res.json(inscriptionEvent)
      } else {
        res.status(500).json(error.parse('inscriptionEvents-03'))
      }
    } catch (e) {
      res.status(500).json(error.parse('inscriptionEvents-02', e))
    }
  }

  api.list = async (req, res) => {
    try {
      const inscriptionEvents = await models.InscriptionEvent.findAll({})
      res.json(inscriptionEvents)
    } catch (e) {
      res.status(500).json(error.parse('inscriptionEvents-02', e))
    }
  }

  api.update = async (req, res) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(500).json(error.parse('inscriptionEvents-02', 'Error during validation'))
    }

    if (isEmpty(errors)) {
      try {
        const inscriptionEvent = await models.InscriptionEvent.findById(req.params.id)
        const updatedInscriptionEvent = await inscriptionEvent.update(req.body, { fields: Object.keys(req.body) })
        res.json(updatedInscriptionEvent)
      } catch (e) {
        res.status(500).json(error.parse('inscriptionEvents-02', e))
      }
    } else {
      res.status(400).json(error.parse('inscriptionEvents-02', { errors }))
    }
  }

  // should this respond with an error when the id does not exist?
  api.delete = async (req, res) => {
    try {
      const inscriptionEvent = await models.InscriptionEvent.destroy({ where: { id: req.params.id } })
      res.sendStatus(204)
    } catch (e) {
      res.status(500).json(error.parse('inscriptionEvents-02', e))
    }
  }

  return api
}
