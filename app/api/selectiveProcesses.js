module.exports = app => {

  const models = require('../models');
  const api = {};
  const error = app.errors.selectiveProcesses;

  api.list = (req, res) => {
    req.query = {
      page: req.query.page * 1 || 1,
      limit: (req.query.limit * 1 <= 100 ? req.query.limit * 1 : 100) || 5
    };
    models.SelectiveProcess
      .findAll({
        offset: ((req.query.page - 1) * req.query.limit),
        limit: req.query.limit
      })
      .then(selectiveProcesses => {
        models.SelectiveProcess
          .count()
          .then(count => {
            res.json({
              "info": {
                "count": count,
                "currentPage": req.query.page,
                "numberOfPages": Math.ceil(count / req.query.limit)
              },
              "selectiveProcesses": selectiveProcesses
            });
          });
      }, e => {
        res.status(500).json(error.parse('selectiveProcesses-01', {}));
      });
  }

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.number) || !(req.body.year)) {
      res.status(400).json(error.parse('selectiveProcesses-01', {}));
    } else {
      models.SelectiveProcess
        .create(req.body)
        .then(_ => {
          res.sendStatus(201)
        }, e => {
          if (e.number === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('selectiveProcesses-02', e));
          else if (e.number === 'SequelizeValidationError') res.status(400).json(error.parse('selectiveProcesses-03', e));
          else res.status(500).json(error.parse('selectiveProcesses-04', e));
        });
    }
  };

  api.specific = (req, res) => {
    models.SelectiveProcess
      .findById(req.params.id)
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

  return api;
}

