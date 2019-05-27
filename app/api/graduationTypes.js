module.exports = app => {
  const models = require('../models');
  const api = {};
  const error = app.errors.graduationTypes;

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name)) {
      res.status(400).json(error.parse('graduationTypes-01', {}));
    } else {
      models.GraduationType
        .create(req.body)
        .then(_ => {
          res.sendStatus(201)
        }, e => {
          res.status(500).json(error.parse('graduationTypes-02', e));
        });
    }

  }

  api.list = (req, res) => {
    models.GraduationType
      .findAll({})
      .then(graduationTypes => { 
        res.json(graduationTypes);
      }, e => {
        res.status(500).json(error.parse('graduationTypes-02', e));
      })
  }

  api.specific = (req, res) => {
    models.GraduationType
      .findById(req.params.id)
      .then(graduationType => {
        if (!graduationType) {
          res.status(400).json(error.parse('graduationType-03', e))
        } else {
          res.json(graduationType)
        }
      })
  }

  api.update = (req, res) => {
    models.GraduationType
      .findById(req.params.id)
      .then(graduationType => {
        if(!graduationType) {
          res.status(400).json(error.parse('graduationTypes-03', {}));
        } else {
          graduationType
            .update(req.body, {fields: Object.keys(req.body)})
            .then(
              updated => res.json(updated),
              e => res.status(500).json(error.parse('graduationTypes-02', e))
            );
        }
      })
  }

  api.delete = (req, res) => {
    models.GraduationType
      .destroy({where: {id: req.params.id }})
      .then( 
        _ => res.sendStatus(204), 
        e => res.status(500).json(error.parse('graduationTypes-02', e))
      );
  }

  return api;
}
