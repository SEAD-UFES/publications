/** @format */

const models = require('../models')
const error = require('../errors/auth')
const api = {}

const paramRoute = async url => {
  const params = url.split('/')
  const model = params[2]
  const id = params[3]

  let query

  const eagerLoad = {
    include: [
      {
        model: models.SelectiveProcess,
        required: true
      }
    ]
  }

  switch (model) {
    case 'selectiveprocesses':
      try {
        query = await models.SelectiveProcess.findById(id)

        return query.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Selective Process.')
      }
      break

    case 'publications':
      try {
        query = await models.Publication.findById(id, eagerLoad)
        return query.SelectiveProcess.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Publication.')
      }
      break

    case 'calls':
      try {
        query = await models.Call.findById(id, eagerLoad)
        return query.SelectiveProcess.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Call.')
      }
      break

    case 'steps':
      try {
        query = await models.Step.findById(id, eagerLoad)
        return query.SelectiveProcess.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Step.')
      }
      break

    case 'vacancies':
      try {
        query = await models.Vacancy.findById(id, eagerLoad)
        return query.SelectiveProcess.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Vacancy.')
      }
      break

    default:
      throw new Error('Unable to find any Course related to this route.')
  }
}

const bodyRoute = async body => {
  if (body.selectiveProcess_id) {
    try {
      let query = await models.SelectiveProcess.findById(body.selectiveProcess_id)
      return query.course_id
    } catch (e) {
      throw new Error('Unable to find Course related to this Call/Publication.')
    }
  } else if (body.call_id) {
    try {
      let query = await models.Call.findById(body.call_id, eagerLoad)
      return query.SelectiveProcess.course_id
    } catch (e) {
      throw new Error('Unable to find Course related to this Step/Vacancy.')
    }
  } else throw new Error('Unable to find any Course related to this route.')
}

const getCourseId = async req => {
  const params = req.url.split('/')
  const model = params[2]
  const id = params[3]

  let target_course_id = null

  if (req.method === 'POST') {
    try {
      if (req.body && req.body.course_id) {
        target_course_id = req.body.course_id
      } else {
        target_course_id = req.body ? await bodyRoute(req.body) : await bodyRoute(req.query)
      }
    } catch (err) {
      throw err
    }
  } else if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'PUT') {
    if (model && id) {
      try {
        target_course_id = await paramRoute(req.url)
      } catch (err) {
        throw err
      }
    }
  }

  if (!target_course_id) {
    throw new Error('Unable to find any Course.')
  }

  return target_course_id
}

module.exports = {
  paramRoute,
  bodyRoute,
  getCourseId
}
