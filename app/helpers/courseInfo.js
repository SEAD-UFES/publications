module.exports = app => {
  const models = require('../models');
  const api = {};

  paramRoute = async (url) => {
    const params  = url.split('/')
    const model   = params[2]
    const id      = params[3]

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
        query = await models.SelectiveProcess
          .findById(id)

        return query.course_id;
        break;

      case 'publications':
        query = await models.Publication
          .findById(id, eagerLoad)
        return query.SelectiveProcess.id;
        break;

      case 'calls':
        query = await models.Call
          .findById(id, eagerLoad)
        return query.SelectiveProcess.id;
        break;

      case 'steps':
        query = await models.Step
          .findById(id, eagerLoad)        
        return query.SelectiveProcess.id;
        break;

      case 'vacancies':
        query = await models.Vacancy
          .findById(id, eagerLoad)       
        return query.SelectiveProcess.id;
        break;
    }
  },
  bodyRoute = async (body) => {
    if (body.selectiveProcess_id) {
      try {
        query = await models.SelectiveProcess
          .findById(req.body.selectiveProcess_id)

        return query.course_id
      } catch (e) {
        res
          .status(401)
          .json({'erro': new Error("Deu ruim no try/catch #1")});
      }
    } else if (body.call_id) {
      try {
        query = await models.Call
          .findById(req.body.call_id, eagerLoad)
        
        return query.SelectiveProcess.course_id;
      } catch (e) {
        res.status(401)
          .json({'erro': new Error("Deu ruim no try/catch #2")});
      }
    } else res.status(401)
              .json({'erro': new Error("Deu ruim no try/catch #2")});
  } 
}
