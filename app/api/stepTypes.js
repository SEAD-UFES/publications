module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.stepTypes;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('stepTypes-01', {}));
        } else {
            models.StepType
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('stepTypes-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.StepType
            .findAll({})
            .then(stepTypes => {
                res.json(stepTypes);
            }, e => {
                res.status(500).json(error.parse('stepTypes-02', e));
            });
    }

    api.update = (req, res) => {
        models.StepType
            .findById(req.params.id)
            .then(stepType => {
                if(!stepType) res.status(400).json(error.parse('stepTypes-03', {}));
                else stepType.update(req.body, {fields: Object.keys(req.body)})
                                .then(updated => res.json(updated), e => res.status(500).json(error.parse('stepTypes-02', e)));

            });
    }

    api.delete = (req, res) => {
        models.StepType
            .destroy({ where: { id: req.params.id } })
            .then(_ => res.sendStatus(204), e => res.status(500).json(error.parse('stepTypes-02', e)));
    }
  
    return api;
  }