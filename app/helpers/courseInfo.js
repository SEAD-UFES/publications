
  const models = require('../models');
  const error = require('../errors/auth');
  const api = {};

  const paramRoute = async (url) => {
    const params  = url.split('/')
    const id      = params.pop()
    const model   = params.pop()

    let query; 

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
          query = await models.SelectiveProcess
            .findById(id)

          return query.course_id;
        } catch (e) {
          throw new Error('Unable to find Course related to this Selective Process.' )
        }
        break;

      case 'publications':
        try {
          query = await models.Publication
            .findById(id, eagerLoad)
          return query.SelectiveProcess.course_id;
        } catch (e) {
          throw new Error('Unable to find Course related to this Publication.' )
        }
        break;

      case 'calls':
        try {
          query = await models.Call
            .findById(id, eagerLoad)
          return query.SelectiveProcess.course_id;
        } catch (e) {
          throw new Error('Unable to find Course related to this Call.' )
        }
        break;

      case 'steps':
        try {
          query = await models.Step
            .findById(id, eagerLoad)        
          return query.SelectiveProcess.course_id;
        } catch (e) {
          throw new Error('Unable to find Course related to this Step.' )
        }
        break;

      case 'vacancies':
        try {
          query = await models.Vacancy
            .findById(id, eagerLoad)       
          return query.SelectiveProcess.course_id;
        } catch (e) {
          throw new Error('Unable to find Course related to this Vacancy.' )
        }
        break;

      default: throw new Error('Unable to find any Course related to this route.')
    }
  }

  const bodyRoute = async (body) => {

    if (body.selectiveProcess_id) {
      try {
        let query = await models.SelectiveProcess
          .findById(body.selectiveProcess_id)
        return query.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Call/Publication.')
      }
    } else if (body.call_id) {
      try {
        let query = await models.Call
          .findById(body.call_id, eagerLoad)       
        return query.SelectiveProcess.course_id
      } catch (e) {
        throw new Error('Unable to find Course related to this Step/Vacancy.' )
      }
    } else throw new Error('Unable to find any Course related to this route.' )
  } 

module.exports = { paramRoute, bodyRoute } 

