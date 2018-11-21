module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.register;
    const db = require('../models/index');
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]')) {
            res.status(400).json(error.parse('register-01', {}));
        }else {
            console.log(req.body);
            db.sequelize.transaction(t => {
                return models.Person
                    .create(req.body, {
                        include: [{
                            model: models.User
                        }],
                        transaction: t
                    }).then(function(person){
                        res.sendStatus(201);
                    }).catch(e => {
                        t.rollback();
                        if(e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('register-02', e));
                        if(e.name === 'SequelizeValidationError') res.status(400).json(error.parse('register-03', e));
                        else res.status(500).json(error.parse('register-04', e));
                    })
            });
        }
    }
  
    return api;
  }
  