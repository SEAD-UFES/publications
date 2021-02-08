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
    unauthorizedDevMessage
  } = require('../helpers/error')
  const { validateBody, validatePermissionCreate, validatePermissionRead } = require('../validators/petitionreply.js')
  const { filter_PetitionReply_VisibleForThisUser } = require('../helpers/petitionReplyHelpers')

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
        return res.status(401).json(error.parse('petitionReply-401', unauthorizedDevMessage(permissionErrors)))
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

  //PetitionReply list
  api.list = async (req, res) => {
    //recolher eventos da lista de pesquisa forncecida.
    const petitionIds = req.query.petition_ids ? req.query.petition_ids : []
    const ids = req.query.ids ? req.query.ids : []

    try {
      //validation
      if (petitionIds.length === 0 && ids.length === 0) {
        const errors = { message: 'Array de pesquisa (petition_ids ou ids) deve ser enviado.' }
        return res.status(400).json(error.parse('petitionReply-400', validationDevMessage(errors)))
      }

      //clausulas where para query de calculo.
      let whereId = ids.length > 0 ? { id: ids } : {}
      let wherePetitionId = petitionIds.length > 0 ? { petition_id: petitionIds } : {}

      //delaração de includes para query de calculo.
      const includeProcess = { model: models.SelectiveProcess, required: false }
      const includeCall = { model: models.Call, required: false, include: [includeProcess] }
      const includeCalendar = { model: models.Calendar, required: false, include: [includeCall] }
      const includeInscriptionEvent = { model: models.InscriptionEvent, required: false, include: [includeCalendar] }
      const includeInscription = { model: models.Inscription, required: false, include: [includeInscriptionEvent] }
      const includePetition = { model: models.Petition, required: false, include: [includeInscription] }

      //query para calculo.
      const petitionReplies = await models.PetitionReply.findAll({
        include: [includePetition],
        where: { ...whereId, ...wherePetitionId }
      })

      //Filtrar petitionIds visiveis para esse usuário (e remover não autorizados da pesquisa).
      const visiblePetitionReplies = filter_PetitionReply_VisibleForThisUser(petitionReplies, req.user)
      const visiblePetitionReplyIds = visiblePetitionReplies.map(pr => pr.id)

      //Query para enviar.
      const filtred_petitionReplies = await models.PetitionReply.findAll({
        where: { id: visiblePetitionReplyIds }
      })

      return res.json(filtred_petitionReplies)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('petitionReply-500', unknownDevMessage(err)))
    }
  }

  return api
}
