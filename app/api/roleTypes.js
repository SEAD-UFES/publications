module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.roleTypes;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('roleTypes-01', {}));
        } else {
            models.RoleType
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('roleTypes-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.RoleType
            .findAll({})
            .then(roleTypes => {
                res.json(roleTypes);
            }, e => {
                res.status(500).json(error.parse('roleTypes-02', e));
            });
    }
  
    return api;
  }