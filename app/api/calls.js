module.exports = app => {
  const Sequelize = require('sequelize');
  const models = require('../models');
  const api = {};
  const error = app.errors.calls;

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.number)) {
      res.status(400).json(error.parse('calls-01', {}));
    } else {
      let options = {where: {
        endingDate: {
          [Sequelize.Op.gte]:Date.now()
        },
        selectiveProcess_id: req.body.selectiveProcess_id
      }};
      models.Call
        .findOne(options).then(result => {
          if(result){
            res.status(400).json(error.parse('calls-05', {}))
          }else{
            models.Call
              .create(req.body)
              .then(call => {
                res.status(201)
                  .json({
                    "id": call.id
                  });
              }, e => {
                if(e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('calls-03', e));
                else res.status(500).json(error.parse('calls-02', {}));
            });
          }
        });
    }
  };

  api.list = (req, res) => {    
    models.Call
      .findAll({})
      .then(calls => {
        res.json(calls);
      }, e => {
        res.status(500).json(error.parse('calls-01', e));
      });
  };

  api.specific = (req, res) => {
    models.Call
      .findById(req.params.id)
      .then(call => {
        res.json(call)
      }, e => {
        res.status(500).json(error.parse('calls-02', e));
      });
  };

  api.update = (req, res) => {
    models.Call
      .findById(req.params.id)
      .then(call => {
        call.update(req.body, {fields: Object.keys(req.body)})
        .then(updatedCall => {
          res.json(updatedCall);
        }, e => {
          if(e.name === "SequelizeUniqueConstraintError") {
            res.status(400).json(error.parse('calls-02', e));
          } else {
            res.status(500).json(error.parse('calls-02', e));
          }
        })
      }, e => {
        res.status(500).json(error.parse('calls-02', e))
      })
  };

  api.delete = (req, res) => {
    models.Call
      .destroy({where: {id: req.params.id}})
      .then( _ => {
        res.sendStatus(204);
      }, e => {
        res.status(500).json(error.parse('calls-04'));
      });
  }

  return api;
}
