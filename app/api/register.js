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
                            model: models.physicalPerson,
                            include: [{
                                model: models.User
                            }],
                            transaction: t
                        }],
                        transaction: t
                    }).then(function(person){
                        console.log(person);
                    }).catch(e => {
                        t.rollback();
                    })
            });
            
        }
    }
  
    return api;
  }
  