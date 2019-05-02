module.exports = app => {

  const models = require('../models');
  const Sequelize = require('sequelize');
  const error = app.errors.selectiveProcesses;
  const api = {};
  const $or = Sequelize.Op.or; // sequelize OR shortcut
  const check = require('../helpers/permissionCheck');


  api.list = (req, res) => {

    // stores all search restrictions 
    let where = {} 

    // pagination, limit, year
    req.query.limit = (req.query.limit > 100) ? 100 : req.query.limit * 1 || 10;
    req.query.page = req.query.page * 1 || 1;
    req.query.offset = ((req.query.page - 1) * req.query.limit);
  
    if (req.query.year && req.query.year.length === 4)
      where.year = req.query.year

    const hasRoles = check.hasRoles(req.user)

    if (hasRoles) {
      const isAdmin = check.isAdmin(req.user)
      const isGlobal = check
        .hasGlobalPermission(req.user, 'processo seletivo listar')

      if (!(isAdmin || isGlobal)) { 
        const allowedCourseIds = check
          .allowedCourseIds(req.user, 'processo seletivo listar')
   
          where[$or] = [
            { visible: true},
            { course_id: allowedCourseIds } 
          ]
      }
    } else {
      // only access visible/published selective processes
      where.visible = true
    }

    models.SelectiveProcess
      .findAndCountAll({
        include: [
          {
            model: models.Call,
            required: false
          },
          {
            model: models.Course,
            required: false
          }
        ],
        distinct: true,
        limit: req.query.limit,
        offset: req.query.offset,
        page: req.query.page,
        where
      })
      .then(selectiveProcesses => res.json({
          "info": {
            "count": selectiveProcesses.count,
            "currentPage": req.query.page ? req.query.page * 1 : 1,
            "numberOfPages": Math.ceil(selectiveProcesses.count / req.query.limit)
          },
          "selectiveProcesses": selectiveProcesses.rows
        }),
        e => {
          res.status(500).json({ e }) // error.parse('selectiveProcesses-01', e));
        });
  };

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.number) || !(req.body.year)) {
      res.status(400).json(error.parse('selectiveProcesses-01', {}));
    } else {
      models.SelectiveProcess
        .create(req.body)
        .then(selectiveProcess => {
          res.status(201)
            .json({
              "id": selectiveProcess.id
            });
        }, e => {
          if (e.number === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('selectiveProcesses-02', e));
          else if (e.number === 'SequelizeValidationError') res.status(400).json(error.parse('selectiveProcesses-03', e));
          else res.status(500).json(error.parse('selectiveProcesses-04', e));
        });
    }
  };

  api.specific = (req, res) => {
    models.SelectiveProcess
      .findById(req.params.id, {
        include: [
          {
            model: models.Call,
            required: false,
            include: [
              {
                model: models.Step,
                required: false,
                include: [
                  {
                    model: models.StepType,
                    required: false
                  }
                ]
              },
              {
                model: models.Vacancy,
                required: false,
                include: [
                  {
                    model: models.Assignment,
                    required: false
                  },
                  {
                    model: models.Restriction,
                    required: false
                  },
                  {
                    model: models.Region,
                    required: false
                  }
                ]
              }
            ]
          },
          {
            model: models.Course,
            required: false
          },
          {
            model: models.Publication,
            required: false,
            include: [
              { 
                model: models.PublicationType,
                required: true
              }
            ]         
          }
        ],
        order: [
          [ models.Call, 'createdAt', 'ASC' ],
          [ models.Call, models.Step, 'number', 'ASC' ],
          [ models.Publication, 'date', 'DESC' ],
          [ models.Publication, 'createdAt', 'DESC' ]
        ]
      })
      .then(selectiveProcess => {
        if (!selectiveProcess) {
          res.status(400).json(error.parse('selectiveProcesses-05', {}))
        } else {
          res.json(selectiveProcess);
        }
      }, e => {
        res.status(500).json(error.parse('selectiveProcesses-05', e));
      });
  };

  api.update = (req, res) => {

    if (!(Object.prototype.toString.call(req.body) === '[object Object]')) {
      res.status(400).json(error.parse('selectiveProcesses-01', {}));
    } else {
      models.SelectiveProcess
        .findOne({
          where: {
            id: req.params.id
          }
        })
        .then(selectiveProcess => {
          if (!selectiveProcess) res.status(400).json(error.parse('selectiveProcesses-05', {}));
          else selectiveProcess
            .update(req.body)
            .then(updatedSelectiveProcess => {
              res.json(updatedSelectiveProcess);
            }, e => res.status(500).json(error.parse('selectiveProcesses-04', e)));
        }, e => res.status(500).json(error.parse('selectiveProcesses-04', e)));
    }
  };

  api.delete = (req, res) => {
    models.SelectiveProcess
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(_ => {
        res.sendStatus(204);
      }, e => {
        res.status(500).json(error.parse('selectiveProcesseses-04'));
      });
  }

  api.listPublic = (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      req.query.limit = req.query.limit > 100 ? 100 : req.query.limit * 1 || 10
      req.query.page = req.query.page * 1 || 1
      req.query.offset = (req.query.page - 1) * req.query.limit

      let where = { 'visible': true }

      if (req.query.year && req.query.year.length === 4) {
        where.year = req.query.year
      }


      models.SelectiveProcess.findAndCountAll({
        include: [
          {
            model: models.Call,
            required: false
          },
          {
            model: models.Course,
            required: false
          }
        ],

        limit: req.query.limit,
        offset: req.query.offset,
        page: req.query.page,
        where
      }).then(
        selectiveProcesses =>
          res.json({
            info: {
              count: selectiveProcesses.count,
              currentPage: req.query.page ? req.query.page * 1 : 1,
              numberOfPages: Math.ceil(selectiveProcesses.count / req.query.limit)
            },
            selectiveProcesses: selectiveProcesses.rows
          }),
        e => {
          res.status(500).json(error.parse('selectiveProcesses-01', e))
        }
      )
    }
  }

  api.specificPublic = (req, res, next) => {
    if (req.headers['x-access-token']) {
      next()
    } else {
      models.SelectiveProcess.findById(req.params.id, {
        include: [
          {
            model: models.Call,
            required: false,
            include: [
              {
                model: models.Step,
                required: false,
                include: [
                  {
                    model: models.StepType,
                    required: false
                  }
                ]
              },
              {
                model: models.Vacancy,
                required: false,
                include: [
                  {
                    model: models.Assignment,
                    required: false
                  },
                  {
                    model: models.Restriction,
                    required: false
                  },
                  {
                    model: models.Region,
                    required: false
                  }
                ]
              }
            ]
          },
          {
            model: models.Course,
            required: false
          },
          {
            model: models.Publication,
            required: false,
            include: [
              {
                model: models.PublicationType,
                required: true
              }
            ]
          }
        ],
        order: [
          [models.Call, 'createdAt', 'ASC'],
          [models.Call, models.Step, 'number', 'ASC'],
          [models.Publication, 'date', 'DESC'],
          [models.Publication, 'createdAt', 'DESC']
        ]
      }).then(
        selectiveProcess => {
          if (!selectiveProcess || !selectiveProcess.visible) {
            res.status(400).json(error.parse('selectiveProcesses-05', {}))
          } else {
            res.json(selectiveProcess)
          }
        },
        e => {
          res.status(500).json(error.parse('selectiveProcesses-05', e))
        }
      )
    }
  }

  return api;
}
