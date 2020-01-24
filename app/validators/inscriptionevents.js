/** @format */

'use strict'

const Sequelize = require('sequelize')
const models = require('../models')
const { isUUID, isNumeric, isISO8601 } = require('validator')
const { isEmpty } = require('../helpers/is-empty.js')

const validBool = value => [true, false, 0, 1].includes(value)

const validate = async ({ body, method, params }) => {
  try {
    if (method === 'PUT')
      return {
        ...(await validateId(params.id)),
        ...(await validateBody(body, params.id))
      }
    else return await validateBody(body)
  } catch (e) {
    console.log('Error in InscrptionEvent validation.')
    throw e
  }
}

const validateId = async id => {
  const errors = {}

  if (isUUID(id)) {
    try {
      const foundInscription = await models.InscriptionEvent.findById(id)
      if (isEmpty(foundInscription)) errors.id = 'Não há inscrições correspondentes a esse identificador.'
    } catch (e) {
      errors.id = 'Não foi possível encontrar essa inscrição no banco de dados.'
    }
  } else errors.id = 'A inscrição enviada não tem um identificador válido.'

  return errors
}

const validateBody = async (
  {
    startDate,
    endDate,
    numberOfInscriptionsAllowed,
    oneInscriptionPerAssignment,
    oneInscriptionPerRegion,
    oneInscriptionPerRestriction
  },
  hasId
) => {
  const ignoreOwnId = hasId ? { id: { [Sequelize.Op.not]: hasId } } : {}
  const errors = {}

  if (!startDate || !isISO8601(startDate))
    errors.startDate = 'A inscrição precisa de uma data de abertura válida, posterior a data atual.' // onde eu checo ser posterior ????

  if (!endDate || !isISO8601(endDate))
    errors.endDate = 'A inscrição precisa de uma data de fechamento válida, posterior a data atual.' // onde eu checo ser posterior ????

  if (!errors.startDate && !errors.endDate && startDate >= endDate)
    errors.startDate = errors.endDate = 'A data de fechamento da inscrição precisa ser posterior a data de abertura.'

  if (typeof numberOfInscriptionsAllowed !== 'undefined' && !Number.isInteger(numberOfInscriptionsAllowed))
    errors.numberOfInscriptionsAllowed = 'O número de inscrições permitidas precisa ser um número inteiro.'

  if (typeof oneInscriptionPerAssignment !== 'undefined' && !validBool(oneInscriptionPerAssignment))
    errors.oneInscriptionPerAssignment =
      'É necessário definir se é permitido fazer mais de uma inscrição por atribuição.'

  if (typeof oneInscriptionPerRegion !== 'undefined' && !validBool(oneInscriptionPerRegion))
    errors.oneInscriptionPerRegion = 'É necessário definir se é permitido fazer mais de uma inscrição por região.'

  if (typeof oneInscriptionPerRestriction !== 'undefined' && !validBool(oneInscriptionPerRestriction))
    errors.oneInscriptionPerRestriction =
      'É necessário definir se é permitido fazer mais de uma inscrição por restrição.'

  return errors
}

module.exports = { validate }
