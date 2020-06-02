/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.inscriptionEvents
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validate, validateBodyV2, validatePermission } = require('../validators/inscriptionevents.js')
  const { isEmpty } = require('../helpers/is-empty.js')

  //InscriptionEvent create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBodyV2(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('calendar-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, null)
      if (permissionErrors) {
        return res.status(401).json(error.parse('calendar-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.InscriptionEvent.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  api.read = async (req, res) => {
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
