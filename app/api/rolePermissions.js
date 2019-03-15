module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.rolePermissions;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.roleType_id) || !(req.body.permission_id)) {
            res.status(400).json(error.parse('rolePermissions-01', {}));
        } else {
            models.RolePermission
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('rolePermissions-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.RolePermission
            .findAll({})
            .then(rolePermissions => {
                res.json(rolePermissions);
            }, e => {
                res.status(500).json(error.parse('rolePermissions-02', e));
            });
    }

    api.specific = (req, res) => {
        models.RolePermission
          .findById(req.params.id, 
            {
              include: [
                  {
                      model: models.RoleType,
                      required: false
                  },
                  {
                      model:models.Permission,
                      required: false
                  }
                ]
            })
          .then(rolePermission => {
            res.json(rolePermission)
          }, e => {
            res.status(500).json(error.parse('rolePermissions-02', e));
          });
    };

    
    return api;
  }