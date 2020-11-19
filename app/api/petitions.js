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
  } = require('../validators/petition.js')
  const { filterVisibleByInscriptionEventIds } = require('../helpers/selectiveProcessHelpers')
  const { findCourseIdByInscriptionEventId } = require('../helpers/courseHelpers')
  const { hasAnyPermission } = require('../helpers/permissionCheck')
  const { findUserByToken } = require('../helpers/userHelpers')

  //Inscription create
  api.create = async (req, res) => {
    try {
      //validation and rules
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('petition-400', validationDevMessage(validationErrors)))
      }

      //permission
      const permissionErrors = await validatePermissionCreate(req, models)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petition-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.Petition.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  //Inscription read
  api.read = async (req, res) => {
    try {
      const toRead = await models.Petition.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('petition-400', idNotFoundDevMessage()))
      }

      //Checar visibilidade/permissão do processo
      //Ou se é visivel e é minha inscrição
      //req.user existe pois estar logado é obrigatório
      const permissionErrors = await validatePermissionRead(req, models, toRead)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petition-401', unauthorizedDevMessage(permissionErrors)))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  //Inscription delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Petition.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('petition-400', idNotFoundDevMessage()))
      }

      //permission
      const permissionErrors = await validatePermissionDelete(req, models, toDelete)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petition-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to delete
      await models.Petition.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      await t.rollback()
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('petition-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  api.list = async (req, res) => {
    //recolher eventos da lista de pesquisa forncecida.
    const petitionEventIds = req.query.petitionEvent_ids ? req.query.petitionEvent_ids : []

    try {
      //validation
      if (petitionEventIds.length === 0) {
        const errors = { message: 'Array de pesquisa (petitionEvent_ids) deve ser enviado.' }
        return res.status(400).json(error.parse('petition-400', validationDevMessage(errors)))
      }

      //Filtrar petitionEventIds visiveis para esse usuário (e remover não autorizados da pesquisa).
      const visiblePetitionEventIds = await filterVisible_PetitionEventIds(petitionEventIds, req.user, models)

      //Filtrar inscription_ids do user
      const person = req.user ? await req.user.getPerson() : null
      const petitionEvents = await models.PetitionEvent.findAll({ where: { id: visiblePetitionEventIds } })
      const inscriptionEvents = petitionEvents.map(PE => PE.inscriptionEvent_id)
      const user_inscriptions = await models.Inscription.findAll({
        where: { inscriptionEvent_id: inscriptionEvents, person_id: person.id }
      })
      const user_inscription_ids = user_inscriptions.map(ins => ins.id)

      //filtrar inscrições de quem tem permissão para ver tudo.

      //query and send
      const inscriptions = await models.Petitions.findAll({
        where: {
          petitionEvent_id: visiblePetitionEventIds,
          inscription_id: user_inscription_ids // inscrições do user.
        }
      })

      return res.json(petitions)

      //if error
    } catch (err) {
      console.log('\n', err, '\n')
      return res.status(500).json(error.parse('inscription-500', unknownDevMessage(err)))
    }
  }

  return api
}
