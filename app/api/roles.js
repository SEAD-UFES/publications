module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.roles;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.roleType_id) || !(req.body.user_id)) {
            res.status(400).json(error.parse('roles-01', {}));
        } else {
            models.Role
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('roles-02', e));
                });
        }
    };
  
    return api;
  }