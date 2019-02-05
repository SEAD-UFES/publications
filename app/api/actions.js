module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.actions;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('actions-01', {}));
        } else {
            models.Action
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('actions-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Action
            .findAll({})
            .then(actions => {
                res.json(actions);
            }, e => {
                res.status(500).json(error.parse('actions-02', e));
            });
    }
  
    return api;
  }