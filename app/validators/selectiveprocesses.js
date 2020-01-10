/** @format */

'use strict'

const Sequelize = require('sequelize')
const models = require('../models')
const { isUUID, isNumeric } = require('validator')
const { isEmpty } = require('../helpers/is-empty.js')

const validate = async ({ body, method, params }) => {
  try {
    if (method === 'PUT')
      return {
        ...(await validateId(params.id)),
        ...(await validateBody(body, params.id))
      }
    else return await validateBody(body)
  } catch (e) {
    console.log('Error in SelectiveProcess validation.')
    throw e
  }
}

const validateId = async id => {
  const errors = {}

  if (isUUID(id)) {
    try {
      const processFound = await models.SelectiveProcess.findById(id)

      // mudar a mensagem nos outros validators também
      if (isEmpty(processFound)) errors.id = 'Não há processo seletivo correspondente a esse identificador.'
    } catch (e) {
      errors.id = 'Não foi possível encontrar esse processo seletivo no banco de dados.'
    }
  } else errors.id = 'O processo seletivo enviado não tem uma identificação válida.'

  return errors
}

const validateBody = async ({ number, year, description, visible, course_id }, hasId) => {
  const ignoreOwnId = hasId ? { id: { [Sequelize.Op.not]: hasId } } : {}
  const errors = {}

  // validate params
  if (!course_id || !isUUID(course_id)) {
    errors.course_id = 'O processo seletivo só pode ser criado se associado a um curso.'
  }

  /* 
   * anything can be accepted as a process 'number' now 
  if (!number || !isNumeric(number) || !/^[0-9]{3}$/.test(number)) {
    errors.number = 'O processo seletivo precisa de um número válido, entre 001 e 999.'
  } 
   */

  if (!number || !typeof number === 'string' || number.replace(/\s+/g, ' ').trim().length < 3) {
    errors.number = 'O processo precisa de um identificador válido.'
  }

  if (!year || !(isNumeric(year) && /^\d{4}$/.test(year) && parseInt(year) > 1990 && parseInt(year) < 2100)) {
    errors.year = 'O processo seletivo precisa de um ano válido.'
  }

  if (!description || !(typeof description === 'string' && description.length > 19 && description.length < 501)) {
    errors.description = 'A descrição do processo seletivo precisa ter entre 20 e 500 caracteres.'
  }

  if (!visible && !(typeof visible === 'boolean')) {
    errors.visible = 'É necessario definir se o projeto estará visível ou oculto.'
  }

  /* does the associated course exist ? */
  if (!errors.course_id) {
    try {
      const course = await models.Course.findById(course_id)
      if (!course) errors.course_id = 'O processo seletivo precisa estar associado à um curso existente.'
    } catch (e) {
      errors.course_id = 'Não foi possível confirmar a existência do curso associado a esse processo seletivo.'
    }
  }

  /* is the process number (identifier) already taken? */
  if (!errors.number || !errors.selectiveProcess_id) {
    try {
      const selectiveProcess = await models.SelectiveProcess.findOne({
        where: {
          number,
          year,
          ...ignoreOwnId
        }
      })

      if (selectiveProcess) errors.number = `Já existe uma chamada com o número ${number} para no ano de ${year}.`
    } catch (e) {
      errors.number = 'Não foi possível confirmar se esse número de chamada está disponível.'
    }
  }

  return errors
}

module.exports = { validate }
