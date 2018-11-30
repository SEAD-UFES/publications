module.exports = app => {
  const models = require('../models');
  const api = {};
  const error = app.errors.publicationTypes;

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name)) {
      res.status(400).json(error.parse('publicationTypes-01', {}));
    } else {
      models.PublicationType
        .create(req.body)
        .then(_ => {
          res.sendStatus(201)
        }, e => {
          if(e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('publicationTypes-03', e));
          else res.status(500).json(error.parse('publicationTypes-02', {}));
        });
    }
  };

  api.list = (req, res) => {    
    models.PublicationType
      .findAll({})
      .then(publicationTypes => {
        res.json(publicationTypes);
      }, e => {
        res.status(500).json(error.parse('publicationTypes-01', e));
      });
  };

  api.specific = (req, res) => {
    models.PublicationType
      .findById(req.params.id)
      .then(publicationType => {
        res.json(publicationType)
      }, e => {
        res.status(500).json(error.parse('publicationTypes-02', e));
      });
  };

  api.update = (req, res) => {
    models.PublicationType
      .findById(req.params.id)
      .then(publicationType => {
        publicationType.update(req.body, {fields: Object.keys(req.body)})
        .then(updatedPublicationType => {
          res.json(updatedPublicationType);
        }, e => {
          if(e.name === "SequelizeUniqueConstraintError") {
            res.status(400).json(error.parse('publicationTypes-02', e));
          } else {
            res.status(500).json(error.parse('publicationTypes-02', e));
          }
        })
      }, e => {
        res.status(500).json(error.parse('publicationTypes-02', e))
      })
  };

  api.delete = (req, res) => {
    models.PublicationType
      .destroy({where: {id: req.params.id}})
      .then( _ => {
        res.sendStatus(204);
      }, e => {
        res.status(500).json(error.parse('publicationTypes-04'));
      });
  }

  return api;
}
