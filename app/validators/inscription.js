/** @format */

'use strict'

const { isUUID } = require('validator')

const { isEmpty } = require('../helpers/is-empty.js')
const { isAdmin, hasGlobalPermission, hasCoursePermission } = require('../helpers/permissionCheck')
const { findCourseIdByInscriptionEventId } = require('../helpers/courseHelpers')
const { filterVisibleByInscriptionEventId } = require('../helpers/selectiveProcessHelpers')
const { checkIsUserInscription } = require('../helpers/inscriptionHelpers')

const validateInscriptionEventId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //value must exists on db
  if (typeof value !== 'undefined') {
    const iE = await db.InscriptionEvent.findByPk(value)
    if (!iE) return 'O evento de inscrição não existe.'
  }

  //no errors
  return null
}

const validatePersonId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //value must exists on db
  if (typeof value !== 'undefined') {
    const person = await db.Person.findByPk(value)
    if (!person) return 'Dados pessoais não existem.'
  }

  //no errors
  return null
}

const validateVacancyId = async (value, db, mode, item) => {
  //value mandatory on create
  if (typeof value === 'undefined' && mode === 'create') {
    return 'Este campo é necessário.'
  }

  //value have to be valid
  if (typeof value !== 'undefined' && (value === null || value === '' || !isUUID(value))) {
    return 'Valor inválido.'
  }

  //value must exists on db
  if (typeof value !== 'undefined') {
    const vacancy = await db.Vacancy.findByPk(value)
    if (!vacancy) return 'A Oferta de vaga não existe.'
  }

  //no errors
  return null
}

const validateUnique_IEv_Per_Vac = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEvent_id && !errors.person_id && !errors.vacancy_id) {
    const inscriptionEvent_id = body.inscriptionEvent_id
    const person_id = body.person_id
    const vacancy_id = body.vacancy_id

    const numOfDuplicates = await db.Inscription.count({
      where: {
        inscriptionEvent_id: inscriptionEvent_id,
        person_id: person_id,
        vacancy_id: vacancy_id
      }
    })
    if (numOfDuplicates > 0) return 'Essa inscrição já está cadastrada.'
  }

  //no errors
  return null
}

const validateEventRestrictions = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEvent_id && !errors.person_id) {
    const vacancyInclude = { model: db.Vacancy, required: false }
    const inscriptionEvent = await db.InscriptionEvent.findByPk(body.inscriptionEvent_id)

    const brotherInscriptions = await db.Inscription.findAll({
      where: { person_id: body.person_id },
      include: [vacancyInclude]
    })

    //validate numberOfInscriptionsAllowed
    if (inscriptionEvent.numberOfInscriptionsAllowed > 0) {
      if (brotherInscriptions.length >= inscriptionEvent.numberOfInscriptionsAllowed) {
        return 'Não é possivel se inscrever em mais vagas.'
      }
    }

    //Selecionando a oferta de vaga para as proximas validações.
    const vacancy = await db.Vacancy.findByPk(body.vacancy_id)

    //validate allowMultipleAssignments
    if (!inscriptionEvent.allowMultipleAssignments) {
      const filterOtherInscByAssigId = assignment_id => inscription =>
        inscription.Vacancy.assignment_id !== assignment_id ? true : false

      const otherAssigIns = brotherInscriptions.filter(filterOtherInscByAssigId(vacancy.assignment_id))
      if (otherAssigIns.length > 0) return 'Não é possivel se inscrever em múltiplos cargos.'
    }

    //validate allowMultipleRegions
    if (!inscriptionEvent.allowMultipleRegions) {
      const filterOtherInsByRegionId = region_id => inscription =>
        inscription.Vacancy.region_id !== region_id ? true : false

      const otherRegionIns = brotherInscriptions.filter(filterOtherInsByRegionId(vacancy.region_id))
      if (otherRegionIns.length > 0) return 'Não é possivel se inscrever em múltiplas regiões.'
    }

    //validate allowMultipleRestrictions
    if (!inscriptionEvent.allowMultipleRestrictions) {
      const filterOtherInsByRestrictionId = restriction_id => inscription =>
        inscription.Vacancy.restriction_id !== restriction_id ? true : false

      const otherRestrictionIns = brotherInscriptions.filter(filterOtherInsByRestrictionId(vacancy.restrction_id))
      if (otherRestrictionIns.length > 0) return 'Não é possivel se inscrever em múltiplas restrições.'
    }

    return null
  }
}

const validateCalendarRestrictions = async (body, db, mode, item, errors) => {
  if (!errors.inscriptionEvent_id) {
    const inscriptionEvent = await db.InscriptionEvent.findByPk(body.inscriptionEvent_id)
    const calendar = await db.Calendar.findByPk(inscriptionEvent.calendar_id)
    const calendarStatus = await calendar.calculateStatus()

    const status = {
      ag: 'Aguardando',
      atd: 'Atrasado por dependência',
      at: 'Atrasado',
      atPE: 'Atrasado (recursos pendentes)',
      ad: 'Em andamento',
      cc: 'Concluído!'
    }

    if (calendarStatus === status['ag']) return 'O período de inscrição não começou.'

    if (calendarStatus === status['atd']) return 'O evento de inscrição está atrasado por uma dependência.'

    if (calendarStatus === status['at']) return 'O evento de inscrição está atrasado.'

    if (calendarStatus === status['atPE']) return 'O evento de inscrição está atrasado (recursos pendentes).'

    //if (calendarStatus === status['ad']) Evento em andamento, sem problemas para se inscrever.

    if (calendarStatus === status['cc']) return 'O evento de inscrição já terminou.'

    //no errors
    return null
  }
}

const validateBody = async (body, db, mode, item) => {
  let errors = {}

  //validações de campo

  const inscriptionEventIdError = await validateInscriptionEventId(body.inscriptionEvent_id, db, mode, item)
  if (inscriptionEventIdError) errors.inscriptionEvent_id = inscriptionEventIdError

  const personIdError = await validatePersonId(body.person_id, db, mode, item)
  if (personIdError) errors.person_id = personIdError

  const vacancyIdError = await validateVacancyId(body.vacancy_id, db, mode, item)
  if (vacancyIdError) errors.vacancy_id = vacancyIdError

  //validações de modelo

  const uniqueError = await validateUnique_IEv_Per_Vac(body, db, mode, item, errors)
  if (uniqueError) {
    errors.message = uniqueError
    return errors
  }

  const eventRestrictionsError = await validateEventRestrictions(body, db, mode, item, errors)
  if (eventRestrictionsError) {
    errors.message = eventRestrictionsError
    return errors
  }

  const calendarRestrictionsError = await validateCalendarRestrictions(body, db, mode, item, errors)
  if (calendarRestrictionsError) {
    errors.message = calendarRestrictionsError
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermission = async (req, db, item) => {
  let errors = {}

  //create case
  if (req.method === 'POST') {
    const errorMessage = 'O usuário não tem permissão para criar essa inscrição.'
    const inscriptionEvent_id = req.body.inscriptionEvent_id
    const person_id = req.body.person_id

    //Only owner can create his inscription
    const isVisible = await filterVisibleByInscriptionEventId(inscriptionEvent_id, req.user, db)
    const isOwner = await checkIsUserInscription({ person_id: person_id }, req.user, db)
    if (isVisible && isOwner) return null

    errors.message = errorMessage
  }

  //delete case
  if (req.method === 'DELETE') {
    const errorMessage = 'O usuário não tem permissão para deletar essa inscrição.'

    //Only owner can delete his inscription
    const isVisible = await filterVisibleByInscriptionEventId(item.inscriptionEvent_id, req.user, db)
    const isOwner = await checkIsUserInscription(item, req.user, db)
    if (isVisible && isOwner) return null

    errors.message = errorMessage
  }

  return !isEmpty(errors) ? errors : null
}

const validatePermissionRead = async (inscription, user, db) => {
  //Im Admin. So, I have permission.
  if (isAdmin(user)) return null

  //I have global permisson. So, I have permission.
  const permission = 'selectiveprocess_read'
  if (hasGlobalPermission(user, permission)) return null

  //I have local Permission. So, I have permisson.
  const courseId = await findCourseIdByInscriptionEventId(inscription.inscriptionEvent_id, db)
  if (hasCoursePermission(user, permission, courseId)) return null

  //The process is visible and the inscription is mine. So i have permission.
  const isVisible = await filterVisibleByInscriptionEventId(inscription.inscriptionEvent_id, user, db)
  const isMyInscription = checkIsUserInscription(inscription, user, db)
  if (isVisible && isMyInscription) return null

  //if no permission
  return { message: 'O usuário não tem permissão para acessar esse recurso.' }
}

//Validate delete
const validateDelete = async (inscription, db) => {
  const errors = {}

  //Não pode ser deletado se estiver fora do periodo de inscrição.
  const inscriptionEvent = await db.InscriptionEvent.findByPk(inscription.inscriptionEvent_id)
  const calendar = await db.Calendar.findByPk(inscriptionEvent.calendar_id)
  const calendarStatus = await calendar.calculateStatus()
  const status = {
    ag: 'Aguardando',
    atd: 'Atrasado por dependência',
    at: 'Atrasado',
    atPE: 'Atrasado (recursos pendentes)',
    ad: 'Em andamento',
    cc: 'Concluído!'
  }
  if (calendarStatus !== status['ad']) errors.id = 'Não é possivel excluir inscrições fora do periodo de inscrição.'

  //não pode ser deletado se tiver uma Petition associada.
  const petitions = await models.Petition.count({ where: { inscription_id: inscription.id } })
  if (petitions > 0) {
    errors.id = 'Esta inscrição é dependência de recurso ativo.'
    return errors
  }

  return !isEmpty(errors) ? errors : null
}

//validateDeleteBody
const validateDeleteBody = (body, db) => {
  let errors = {}

  const descriptionError = validateDescription(body.description, db)
  if (descriptionError) errors.description = descriptionError

  return !isEmpty(errors) ? errors : null
}

const validateDescription = (value, db) => {
  //value is necessary
  if (typeof value === 'undefined') {
    return 'Este campo é necessário.'
  }

  //value is valid
  if (typeof value !== 'undefined' && (value === null || value === '')) {
    return 'Este campo é requerido.'
  }

  //tamanho mínimo
  if (typeof value !== 'undefined' && (typeof value !== 'string' || value.length <= 20 || value.length >= 255)) {
    return 'A justificativa precisa ter entre 20 e 255 caracteres.'
  }

  //no errors
  return null
}

module.exports = { validateBody, validatePermission, validatePermissionRead, validateDelete, validateDeleteBody }
