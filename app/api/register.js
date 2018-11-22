module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.register;
    const db = require('../models/index');
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.cpf) || !(req.body.User.login)) {
            res.status(400).json(error.parse('register-01', {}));
        }else {
            models.Person.findOne(
                {
                    where: {cpf: req.body.cpf}
                }
            ).then(p => {
                models.User.findOne(
                    {
                        where: {login: req.body.User.login}
                    }
                ).then(u => {
                    if(p || u){
                        let e = {
                            cpf: "Ok.",
                            login: "Ok."
                        }
                        p?e.cpf="CPF já cadastrado.":delete e.cpf;
                        u?e.login="Login já cadastrado.":delete e.login;
                        res.status(400).json(error.parse('register-05', e));
                    }else{
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
                });
            });
        }
    }
  
    return api;
  }
  