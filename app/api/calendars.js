/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.calendars
  const { validationDevMessage, unknownDevMessage } = require('../helpers/error')
  const { validateBody } = require('../validators/calendar')

  //Vacancy create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      console.log('VE:', validationErrors)
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

  api.read = (req, res) => {}

  api.update = (req, res) => {}

  api.delete = (req, res) => {}

  api.list = (req, res) => {}

  return api
}
