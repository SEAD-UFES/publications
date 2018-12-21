module.exports = app => {

  const models = require('../models');
  const api = {};
  const error = app.errors.selectiveProcesses;

  api.list = (req, res) => {
    const today = new Date();
    const thisYear = today.getFullYear();

    let query = {};

    query.offset = req.query.page * 1 || 1;
    query.limit = (req.query.limit <= 100 ? req.query.limit * 1 : 100) || 10;

    if (req.query.year &&
        req.query.year.length === 4 &&
        Number.parseInt(req.query.year) >= 1990 &&
        Number.parseInt(req.query.year) <= (thisYear + 1)
    ) {
      query.where = { "year": req.query.year }
    }

    models.SelectiveProcess
      .findAll( query )
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
        .then(selectiveProcess => {
          res.status(201)
            .json({"id": selectiveProcess.id});
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
