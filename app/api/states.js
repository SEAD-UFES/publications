module.exports = app => {

  const models = require('../models');
  const api = {};
  const error = app.errors.states;

  api.list = (_, res) => {
      models.State
          .findAll({})
          .then(states => {
              res.json(states);
          }, e => {
              res.status(500).json(error.parse('states-01', e));
          });
  }

  api.specific = (req, res) => {
    const searchParameter = req.params.data;

    if (searchParameter.length === 2) { //standard state abbreviation size
      
      models.State.findOne({
        where: {
          abbreviation: searchParameter
        }
      }).then(state => {
        if (state) {
          res.json(state)
        } else {
          res.status(500).json(error.parse('states-02', null));
        }
      }, e => {
        res.status(500).json(error.parse('states-03', e));
      });

    } else if (searchParameter.length === 36) { //standard uuid size
      
      models.State
        .findById(searchParameter)
        .then(state => {
          if (state) {
            res.json(state)
          } else {
            res.status(500).json(error.parse('states-02', null));
          }
        }, e => {
          res.status(500).json(error.parse('states-03', e));
        });
    } else {
      res.status(500).json(error.parse('states-02', null));
    }
  }

  return api;

} 

