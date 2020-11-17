/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.petitionEvents

  const { validationDevMessage, unknownDevMessage, unauthorizedDevMessage } = require('../helpers/error')
  const { validateBody, validatePermissionCreate } = require('../validators/petitionevent.js')

  //PetitionEvent create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('petitionEvent-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermissionCreate(req, models)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petitionEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.PetitionEvent.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionEvent-500', unknownDevMessage(err)))
    }
  }

  //PettionEvent read
  api.read = (req, res) => {}
  api.update = () => {}
  api.delete = () => {}
  api.list = () => {}

  return api
}
