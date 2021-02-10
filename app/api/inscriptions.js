/** @format */

const { Op } = require('sequelize')

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
  const {
    validateBody,
    validatePermission,
    validatePermissionRead,
    validateDeleteBody
  } = require('../validators/inscription.js')
  const { findUserByToken } = require('../helpers/userHelpers')
  const { filter_Inscription_VisibleForThisUserV2 } = require('../helpers/inscriptionHelpers')

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
        return res.status(401).json(error.parse('inscription-401', unauthorizedDevMessage(permissionErrors)))
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
      console.log('\n', err, '\n')
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  //Inscription delete
  api.delete = async (req, res) => {
    const t = await models.sequelize.transaction()
    try {
      const toDelete = await models.Inscription.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('inscription-400', idNotFoundDevMessage()))
      }

      //validate Justification
      const validationErrors = validateDeleteBody(req.body, models)
      if (validationErrors) {
        return res.status(400).json(error.parse('inscription-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermission(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('inscription-401', unauthorizedDevMessage(permissionErrors)))
      }

      //create justification
      const justification = { inscription_id: toDelete.id, description: req.body.description }
      await models.Justification.create(justification, { transaction: t })

      //try to delete
      await models.Inscription.destroy({
        where: { id: req.params.id },
        individualHooks: true,
        transaction: t
      }).then(_ => res.sendStatus(204))

      //commit transaction
      await t.commit()

      //if error
    } catch (err) {
      console.log('\n', err, '\n')
      await t.rollback()
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('inscription-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  api.list = async (req, res) => {
    const inscriptionIds = req.query.inscription_ids ? req.query.inscription_ids : []
    const inscriptionEventIds = req.query.inscriptionEvent_ids ? req.query.inscriptionEvent_ids : []
    const ownerOnly = req.query.ownerOnly === 'true' ? true : false

    try {
      //validation
      if (inscriptionEventIds.length === 0 && inscriptionIds.length === 0) {
        const errors = { message: 'Array de pesquisa (inscriptionEvent_ids ou inscription_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('inscription-400', validationDevMessage(errors)))
      }

      //find user/person
      const user = await findUserByToken(req.headers['x-access-token'], app.get('jwt_secret'), models)
      const person = user ? await user.getPerson() : null

      //clausulas where para query de calculo.
      let whereOwnerId = ownerOnly ? { person_id: person.id } : {}
      let whereId = inscriptionIds.length > 0 ? { id: inscriptionIds } : {}
      let whereInscriptionEventId = inscriptionEventIds.length > 0 ? { inscriptionEvent_id: inscriptionEventIds } : {}

      //delaração de includes para query de calculo.
      const includeProcess = { model: models.SelectiveProcess, required: false }
      const includeCall = { model: models.Call, required: false, include: [includeProcess] }
      const includeCalendar = { model: models.Calendar, required: false, include: [includeCall] }
      const includeInscriptionEvent = { model: models.InscriptionEvent, required: false, include: [includeCalendar] }

      //query para calculo.
      const inscriptions = await models.Inscription.findAll({
        include: [includeInscriptionEvent],
        where: { ...whereId, ...whereInscriptionEventId, ...whereOwnerId }
      })

      //Filtrar inscriptionIds visiveis para esse usuário (e remover não autorizados da pesquisa).
      const visibleInscriptions = filter_Inscription_VisibleForThisUserV2(inscriptions, user)
      const visibleInscriptionIds = visibleInscriptions.map(pr => pr.id)

      //Query para enviar.
      const filtred_inscriptions = await models.Inscription.findAll({ where: { id: visibleInscriptionIds } })

      return res.json(filtred_inscriptions)

      //if error
    } catch (err) {
      console.log('\n', err, '\n')
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  return api
}
