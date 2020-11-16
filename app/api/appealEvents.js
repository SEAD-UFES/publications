/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.appealEvents

  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validateBody, validatePermission } = require('../validators/inscriptionevents.js')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filterVisibleByCalendarId, filterVisibleByCalendarIds } = require('../helpers/selectiveProcessHelpers')

  //AppealEvent create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('appealEvent-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, null)
      if (permissionErrors) {
        return res.status(401).json(error.parse('appealEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.AppealEvent.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('appealEvent-500', unknownDevMessage(err)))
    }
  }

  return api
}
