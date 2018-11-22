module.exports = app => {

  const models = require('../models');
  const api = {};
  const error = app.errors.cities;

  api.list = (req, res) => {
    if (req.params.state.length !== 2){
      res.status(500).json(error.parse('cities-04', null));
    } else {
      models.State
        .findAll({where: {abbreviation:req.params.state}})
        .then(state => {
          if (state !== undefined && state.length > 0) {
            models.City
              .findAll({where: {state_id: state[0].id}})
              .then(cities => {
                res.json(cities);
              }, e => {
                res.status(500).json(error.parse('cities-01', e));
              });      
          } else res.status(500).json(error.parse('cities-04', null));
      }, e => {
        res.status(500).json(error.parse('cities-03', e));
      });
    }
  }

  api.specific = (req, res) => {
    models.City
      .findById(req.params.id)
      .then(city => {
        res.json(city);
      }, e => {
        res.status(500).json(error.parse('cities-02', e));
      });
  }

  return api;
}
