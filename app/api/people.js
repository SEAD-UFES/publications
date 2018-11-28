module.exports = app => {

    const models = require('../models');
    const api = {};
    const error = app.errors.people;

    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.cpf) || !(req.body.surname)) {
            res.status(400).json(error.parse('people-01', {}));
        } else {
            models.Person
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    if(e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('people-02', e));
                    else if(e.name === 'SequelizeValidationError') res.status(400).json(error.parse('people-03', e));
                    else res.status(500).json(error.parse('people-04', e));
                });
        }
    };

    api.specific = (req, res) => {
      models.Person
        .findById(req.params.id)
        .then(person => {
          if(!person) res.status(400).json(error.person('people-05', {}))
          else res.json(person);
        }, e => {
          res.status(500).json(error.parse('people-05', e));
        });
    }

    api.update = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]')) {
            res.status(400).json(error.parse('people-01', {}));
        } else {
            models.Person
                .findOne({where:{user_id:req.params.id}})
                .then(person => {
                    if(!person) res.status(400).json(error.parse('people-05', {}));
                    else person
                            .update(req.body)
                            .then(updatedPerson => {
                                res.json(updatedPerson);
                            }, e => res.status(500).json(error.parse('people-04', e))); 
                }, e => res.status(500).json(error.parse('people-04', e)));
        }
    };

    return api;
}

