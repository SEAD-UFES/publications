module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.permissions;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.target_id) || !(req.body.action_id)) {
            res.status(400).json(error.parse('permissions-01', {}));
        } else {
            models.Permission
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('permissions-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Permission
            .findAll({})
            .then(permissions => {
                res.json(permissions);
            }, e => {
                res.status(500).json(error.parse('permissions-02', e));
            });
    }
  
    return api;
  }