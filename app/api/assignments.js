module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.assignments;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('assignments-01', {}));
        } else {
            models.Assignment
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('assignments-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Assignment
            .findAll({})
            .then(assignments => {
                res.json(assignments);
            }, e => {
                res.status(500).json(error.parse('assignments-02', e));
            });
    }
  
    return api;
  }