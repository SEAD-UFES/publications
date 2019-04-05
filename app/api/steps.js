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
                    if(e.name == "SequelizeValidationError") res.status(400).json(error.parse('steps-03', e));
                    else res.status(500).json(error.parse('steps-02', e));
                });
        }
    };

    api.specific = (req, res) => {
        models.Step
        .findById(req.params.id, {
          include: [
            {
              model: models.Call,
              required: false,
              include: [
                {
                  model: models.SelectiveProcess,
                  required: false,
                  include: [
                    {
                      model: models.Course,
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: models.StepType,
              required: false
            }
          ]          
        }).then(step => {
            res.json(step)
            }, e => {
                res.status(500).json(error.parse('steps-02', e));
            });
    };

    api.update = (req, res) => {
        models.Step
            .findById(req.params.id)
            .then(step => {
                step.update(req.body, {fields: Object.keys(req.body)})
            .then(updatedStep => {
                res.json(updatedStep);
            }, e => {
                if(e.name === "SequelizeUniqueConstraintError") {
                    res.status(400).json(error.parse('steps-02', e));
                } else {
                    res.status(500).json(error.parse('steps-02', e));
                }
            })
            }, e => {
                res.status(500).json(error.parse('steps-02', e))
            })
    };

    api.delete = (req, res) => {
        models.Step
            .destroy({where: {id: req.params.id}})
            .then( _ => {
                res.sendStatus(204);
            }, e => {
                res.status(500).json(error.parse('steps-02', e));
            });
    }

    return api;
  }
