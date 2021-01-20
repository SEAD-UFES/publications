/** @format */

const { Op } = require('sequelize')

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.petitionReplies
  const {
    validationDevMessage,
    unknownDevMessage,
    idNotFoundDevMessage,
    unauthorizedDevMessage,
    forbbidenDeletionDevMessage
  } = require('../helpers/error')
  const {
    validateBody,
    validatePermissionCreate,
    validatePermissionDelete,
    validatePermissionRead,
    validateDeleteBody
  } = require('../validators/petitionreply.js')
  const {
    getCourseIds_from_Petitions,
    filterCourseIds_withPermission,
    getPetitionIds_withCourseIds,
    getPetitionIds_OwnedByUser
  } = require('../helpers/petitionHelpers')

  const { filterVisibleByPetitionEventIds } = require('../helpers/selectiveProcessHelpers')

  //PetitionReply create
  api.create = async (req, res) => {
    try {
      // //validation and rules
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        return res.status(400).json(error.parse('petitionReply-400', validationDevMessage(validationErrors)))
      }

      // //permission
      const permissionErrors = await validatePermissionCreate(req, models)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petition-401', unauthorizedDevMessage(permissionErrors)))
      }

      //try to create
      const created = await models.PetitionReply.create(req.body)
      await created.reload() //para que o retorno seja igual ao de api.read.
      return res.status(201).json(created)

      //if error
    } catch (err) {
      console.log(err)
      return res.status(500).json(error.parse('petitionReply-500', unknownDevMessage(err)))
    }
  }

  //PetitionReply read
  api.read = async (req, res) => {
    try {
      const toRead = await models.PetitionReply.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('petitionReply-400', idNotFoundDevMessage()))
      }

      //checar permissão
      const permissionErrors = await validatePermissionRead(req, models, toRead)
      if (permissionErrors) {
        return res.status(401).json(error.parse('petitionReply-401', unauthorizedDevMessage(permissionErrors)))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionReply-500', unknownDevMessage(err)))
    }
  }

  //PetitionReply delete
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
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('petition-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  //PetitionReply list
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

      const visiblePetitionEventIds = await filterVisibleByPetitionEventIds(petitionEventIds, req.user, models)

      //delaração de includes para query
      const includeProcess = { model: models.SelectiveProcess, required: false }
      const includeCall = { model: models.Call, required: false, include: [includeProcess] }
      const includeCalendar = { model: models.Calendar, required: false, include: [includeCall] }
      const includeInscriptionEvent = { model: models.InscriptionEvent, required: false, include: [includeCalendar] }
      const includeInscription = { model: models.Inscription, required: false, include: [includeInscriptionEvent] }

      //query para calculo.
      const petitions = await models.Petition.findAll({
        include: [includeInscription],
        where: { petitionEvent_id: visiblePetitionEventIds }
      })

      //Filtrar petitionIds que o usuário tem permissão para ler.
      const courseIds = getCourseIds_from_Petitions(petitions)
      const courseIds_withPermission = filterCourseIds_withPermission(req.user, 'petition_read', courseIds)
      const petitionIds_withPermission = getPetitionIds_withCourseIds(petitions, courseIds_withPermission)

      //Filtrar petitionsIds que o usuário é dono.
      const person = req.user ? await req.user.getPerson() : null
      const petitionIds_OwnedByUser = await getPetitionIds_OwnedByUser(petitions, person)

      //Query para enviar.
      const filtred_petitions = await models.Petition.findAll({
        where: {
          [Op.or]: [{ id: petitionIds_withPermission }, { id: petitionIds_OwnedByUser }],
          petitionEvent_id: visiblePetitionEventIds
        }
      })

      return res.json(filtred_petitions)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petition-500', unknownDevMessage(err)))
    }
  }

  return api
}
