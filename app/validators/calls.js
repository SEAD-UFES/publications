/** @format */

'use strict'

const Sequelize = require('sequelize')
const models = require('../models')
const { isUUID, isNumeric, isISO8601 } = require('validator')
const { isEmpty } = require('lodash')

const validate = async ({ body, method, params }) => {
  try {
    if (method === 'PUT')
      return {
        ...(await validateId(params.id)),
        ...(await validateBody(body, params.id))
      }
    else return await validateBody(body)
  } catch (e) {
    console.log('Error in Call validation.')
    throw e
  }
}

const validateId = async id => {
  const errors = {}

  if (isUUID(id)) {
    try {
      const callFound = await models.Call.findById(id)

      if (isEmpty(callFound)) errors.id = 'Essa chamada não está cadastrada.'
    } catch (e) {
      errors.id = 'Não foi possível encontrar essa chamada no banco de dados.'
    }
  } else errors.id = 'A chamada enviada não tem uma identificação válida.'

  return errors
}

const validateBody = async ({ selectiveProcess_id, number, openingDate, endingDate }, hasId) => {
  const ignoreOwnId = hasId ? { id: { [Sequelize.Op.not]: hasId } } : {}
  const errors = {}

  // validate params
  if (!selectiveProcess_id || !isUUID(selectiveProcess_id)) {
    errors.selectiveProcess_id = 'A chamada só pode ser criada se relacionada à um processo seletivo.'
  }

  if (!number || !isNumeric(number) || !/^[0-9]{3}$/.test(number)) {
    errors.number = 'A chamada precisa de um número válido, entre 001 e 999.'
  }

  if (!openingDate || !isISO8601(openingDate))
    errors.openingDate = 'A chamada precisa de uma data de abertura válida, posterior a data atual.'

  if (!endingDate || !isISO8601(endingDate))
    errors.endingDate = 'A chamada precisa de uma data de fechamento válida, posterior a data atual.'

  if (!errors.openingDate && !errors.closingDate && openingDate >= endingDate)
    errors.openingDate = errors.endingDate = 'A data de fechamento da chamada precisa ser posterior a data de abertura.'

  // validade server params
  /* does the selective process exist ? */
  if (!errors.selectiveProcess_id) {
    let selectiveProcess
    try {
      selectiveProcess = await models.SelectiveProcess.findById(selectiveProcess_id)
    } catch (e) {
      errors.selectiveProcess_id = 'Não foi possível confirmar a existência do processo seletivo associado.'
    }

    if (!selectiveProcess) errors.selectiveProcess_id = 'O processo seletivo associado à essa chamada não existe.'
  }

  /* is the call number already taken? */
  if (!errors.number || !errors.selectiveProcess_id) {
    let call

    try {
      call = await models.Call.findOne({
        where: {
          number,
          selectiveProcess_id,
          ...ignoreOwnId
        }
      })
    } catch (e) {
      errors.number = 'Não foi possível confirmar se esse número de chamada está disponível.'
    }

    if (call) errors.number = 'Já existe uma chamada com esse número.'
  }

  /* do the dates conflict with existing calls? */
  if (!errors.openingDate || !errors.endingDate) {
    const overlapingDates = {
      where: {
        [Sequelize.Op.or]: {
          openingDate: {
            [Sequelize.Op.gte]: openingDate,
            [Sequelize.Op.lte]: endingDate
          },
          endingDate: {
            [Sequelize.Op.gte]: openingDate,
            [Sequelize.Op.lte]: endingDate
          }
        },
        selectiveProcess_id,
        ...ignoreOwnId
      }
    }

    try {
      const overlapingDatesFound = await models.Call.findOne(overlapingDates)

      if (overlapingDatesFound)
        errors.openingDate = errors.endingDate = `Conflito de Datas, as datas dessa chamada entram em conflito com as da chamada número ${
          overlapingDatesFound.number
        }. (${getFormatedDate(overlapingDatesFound.openingDate)} - ${getFormatedDate(overlapingDatesFound.endingDate)})`
    } catch (e) {
      errors.openingDate = errors.endingDate =
        'Não foi possível checar se havia conflitos de datas com outras chamadas.'
    }
  }

  return errors
}

const getFormatedDate = dateString => {
  const [year, month, day] = dateString.split(/[-\s]/)

  return `${day}/${month}/${year}`
}

module.exports = { validate }
