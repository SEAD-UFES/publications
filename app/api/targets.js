module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.targets;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.urn)) {
            res.status(400).json(error.parse('targets-01', {}));
        } else {
            models.Target
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('targets-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Target
            .findAll({})
            .then(targets => {
                res.json(targets);
            }, e => {
                res.status(500).json(error.parse('targets-02', e));
            });
    }
  
    return api;
  }