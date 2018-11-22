module.exports = app => {

    const models = require('../models');
    const api = {};
    const error = app.errors.users;

    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.login) || !(req.body.password)) {
            res.status(400).json(error.parse('users-01', {}));
        } else {
            models.User
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    if(e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('users-02', e));
                    else if(e.name === 'SequelizeValidationError') res.status(400).json(error.parse('users-03', e));
                    else res.status(500).json(error.parse('users-04', e));
                });
        }
    };

    api.list = (_, res) => {
        models.User
            .findAll({})
            .then(users => {
                res.json(users);
            }, e => {
                res.status(500).json(error.parse('users-04', e));
            });
    }

    api.specific = (req, res) => {
        models.User
            .findById(req.params.id,{
                include: [{
                    model: models.RoleType,
                    as: 'roles',
                    required: false,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                  }]
            })
            .then(user => {
                res.json(user);
            }, e => {
                res.status(500).json(error.parse('users-04', e));
            });
    }

    api.update = (req, res) => {
        models.User
            .findById(req.params.id)
            .then(user => {
                user.update(req.body)
                .then(updatedUser => {
                    res.json(updatedUser);
                }, e => res.status(500).json(error.parse('users-04', e)));
            }, e => res.status(500).json(error.parse('users-04', e)));
    }

    api.delete = (req, res) => {
        models.User
            .destroy({where: {id: req.params.id}})
            .then( _ => {
                res.sendStatus(204);
            }, e => {
                res.status(500).json(error.parse('users-04', e));
            });
    }

    return api;
}
