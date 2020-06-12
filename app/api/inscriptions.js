/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.inscriptions
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const { validateBody, validatePermission, validatePermissionRead } = require('../validators/inscription.js')
  const { filterVisibleByInscriptionEventIds } = require('../helpers/selectiveProcessHelpers')

  //Inscription create
  api.create = async (req, res) => {
    try {
      //validation and rules
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('inscription-400', validationDevMessage(validationErrors)))
      }

      //permission (caso coberto pelo middleware)
      const permissionErrors = await validatePermission(req, models, null)
      if (permissionErrors) {
        return res.status(401).json(error.parse('inscriptionEvent-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.Inscription.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  //Inscription read
  api.read = async (req, res) => {
    try {
      const toRead = await models.Inscription.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('inscription-400', idNotFoundDevMessage()))
      }

      //Checar visibilidade/permissão do processo
      //Ou se é visivel e é minha inscrição
      //req.user existe pois estar logado é obrigatório
      const permissionErrors = await validatePermissionRead(toRead, req.user, models)
      if (permissionErrors) {
        return res.status(401).json(error.parse('inscription-401', unauthorizedDevMessage(permissionErrors)))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  //Inscription delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Inscription.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('inscription-400', idNotFoundDevMessage()))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('inscription-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.Inscription.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      console.log(err)
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('inscription-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  api.list = async (req, res) => {
    const inscriptionEventIds = req.query.inscriptionEvent_ids ? req.query.inscriptionEvent_ids : []
    try {
      //validation
      if (inscriptionEventIds.length === 0) {
        const errors = { message: 'Array de pesquisa (inscriptionEvent_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('inscription-400', validationDevMessage(errors)))
      }

      //Checar visibilidade dos processos (e remover não autorizados da pesquisa).
      //Tenho req.user pois estar logado é obrigatório nesse caso.
      const user = req.user
      const filtredInscriptionEventIds = await filterVisibleByInscriptionEventIds(inscriptionEventIds, user, models)
      console.log('filtredInscriptionEventIds', filtredInscriptionEventIds)

      //query and send
      const whereInscriptionEventIds =
        filtredInscriptionEventIds.length > 0
          ? { inscriptionEvent_id: filtredInscriptionEventIds }
          : { inscriptionEvent_id: null }
      const inscriptions = await models.Inscription.findAll({ where: { ...whereInscriptionEventIds } })
      return res.json(inscriptions)

      //if error
    } catch (err) {
      console.log('err', err)
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  return api
}
