/** @format */

'use strict'

const Sequelize = require('sequelize')
const models = require('../models')
const { isUUID } = require('validator')
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

const validateBody = async ({ selectiveProcess_id, title, content, visible, override }, hasId) => {
  const errors = {}

  // validate params
  if (!selectiveProcess_id || !isUUID(selectiveProcess_id)) {
    errors.selectiveProcess_id = 'A notícia só pode ser criada se relacionada à um processo seletivo.'
  }

  if (!title || typeof title !== 'string' || title.length == 0) {
    errors.title = 'Campo requerido.'
  }

  if (!content || typeof content !== 'string' || content.length == 0) {
    errors.content = 'Campo requerido.'
  }

  if (visible) {
    if (visible != true && visible != false) {
      errors.visible = 'Valor do campo inválido.'
    }
  }

  if (override) {
    if (override != true && override != false) {
      errors.override = 'Valor do campo inválido.'
    }
  }

  // validade server params
  /* does the selective process exist ? */
  if (!errors.selectiveProcess_id) {
    let selectiveProcess
    const process_structure = { include: [{ model: models.Notice, required: false }] }
    try {
      selectiveProcess = await models.SelectiveProcess.findById(selectiveProcess_id, process_structure)
    } catch (e) {
      errors.selectiveProcess_id = 'Não foi possível confirmar a existência do processo seletivo associado.'
    }

    if (!selectiveProcess) {
      errors.selectiveProcess_id = 'O processo seletivo associado à essa noticia não existe.'
    } else {
      /* selective process already have a notice? */
      if (selectiveProcess.Notices.length > 0) {
        errors.selectiveProcess_id = 'O processo seletivo já possui uma noticia cadastrada.'
      }
    }
  }

  return errors
}

module.exports = { validate }
