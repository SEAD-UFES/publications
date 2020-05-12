/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.calendars
  const { validationDevMessage, unknownDevMessage, idNotFoundDevMessage } = require('../helpers/error')
  const { validateBody } = require('../validators/calendar')

  //Vacancy create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('calendar-400', validationDevMessage(validationErrors)))
      }

      //check permission to this call

      //try to create
      const created = await models.Calendar.create(req.body)
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  api.read = async (req, res) => {
    try {
      const toRead = await models.Calendar.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('calendar-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('calendar-500', unknownDevMessage(err)))
    }
  }

  api.update = (req, res) => {}

  api.delete = (req, res) => {}

  api.list = (req, res) => {}

  return api
}
