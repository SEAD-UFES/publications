/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.roleTypes
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')

  const { validateBody } = require('../validators/roletype.js')

  //RoleType create
  api.create = async (req, res) => {
    try {
      //validation
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('roleType-400', validationDevMessage(validationErrors)))
      }

      //try to create
      const created = await models.RoleType.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('roleType-500', unknownDevMessage(err)))
    }
  }

  //RoleType read
  api.read = async (req, res) => {
    const includePermission = { model: models.Permission, required: false }

    try {
      const toRead = await models.RoleType.findByPk(req.params.id, { include: includePermission })

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('roleType-400', idNotFoundDevMessage()))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('roleType-500', unknownDevMessage(err)))
    }
  }

  //RoleType update
  api.update = async (req, res) => {
    try {
      const toUpdate = await models.RoleType.findByPk(req.params.id)

      //verify valid id
      if (!toUpdate) {
        return res.status(400).json(error.parse('roleType-400', idNotFoundDevMessage()))
      }

      //validation
      const validationErrors = await validateBody(req.body, models, 'update', toUpdate)
      if (validationErrors) {
        return res.status(400).json(error.parse('roleType-400', validationDevMessage(validationErrors)))
      }

      //try to update
      const updated = await toUpdate.update(req.body)
      await updated.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(updated)

      //if error
    } catch (err) {
      console.log(err)
      return res.status(500).json(error.parse('roleType-500', unknownDevMessage(err)))
    }
  }

  api.delete = async (req, res) => {
    try {
      const toDelete = await models.RoleType.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('roleType-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.RoleType.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('roleType-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('roleType-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.RoleType.findAll({}).then(
      roleTypes => {
        res.json(roleTypes)
      },
      e => {
        res.status(500).json(error.parse('roleTypes-02', e))
      }
    )
  }

  return api
}
