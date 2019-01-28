module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.steps;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.resultDate || !req.body.openAppealDate || !req.body.limitAppealDate || !req.body.resultAfterAppealDate) {
            res.status(400).json(error.parse('steps-01', {}));
        } else {
            models.Step
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('steps-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Step
            .findAll({})
            .then(steps => {
                res.json(steps);
            }, e => {
                res.status(500).json(error.parse('steps-02', e));
            });
    }
  
    return api;
  }