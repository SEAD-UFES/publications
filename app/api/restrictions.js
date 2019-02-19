module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.restrictions;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('restrictions-01', {}));
        } else {
            models.Restriction
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('restrictions-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Restriction
            .findAll({})
            .then(restrictions => {
                res.json(restrictions);
            }, e => {
                res.status(500).json(error.parse('restrictions-02', e));
            });
    }

    api.update = (req, res) => {
        models.Restriction
            .findById(req.params.id)
            .then(restriction => {
                if(!restriction) res.status(400).json(error.parse('restrictions-03', {}));
                else restriction.update(req.body, {fields: Object.keys(req.body)})
                                .then(updated => res.json(updated), e => res.status(500).json(error.parse('restrictions-02', e)));

            });
    }

    api.delete = (req, res) => {
        models.Restriction
            .destroy({ where: { id: req.params.id } })
            .then(_ => res.sendStatus(204), e => res.status(500).json(error.parse('restrictions-02', e)));
    }
  
    return api;
  }