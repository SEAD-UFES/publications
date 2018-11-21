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

    return api;
}
