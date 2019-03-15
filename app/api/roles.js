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
  
    api.list = (req, res) => {
      models.Role
        .findAll({
          include: [
            { model: models.User, attributes: { exclude: ['password'] } },
            { model: models.RoleType },
            { model: models.Course, required: false }
          ],
          attributes: { exclude: ['User.password'] }
        })
        .then(roles => {
          res.json(roles)
        }, e => {
          res.status(500).json(error.parse('roles-02', e));
        });
    };

  api.specific = (req, res) => {
    models.Role
      .findOne({
        where: {id: req.params.id}, 
        include: [
          { model: models.User, attributes: { exclude: ['password'] } },
          { model: models.RoleType },
          { model: models.Course, required: false }
        ]})
      .then(role => {
        res.json(role)
      }, e => {
        res.status(500).json(error.parse('roles-02', e));
      })
  }

    api.delete = (req, res) => {
      models.Role
        .destroy({ where: { id: req.params.id }})
        .then(_ => res.sendStatus(204),
          e => res.status(500).json(error.parse('role-02', e)));
    };
  
    return api;
  }
