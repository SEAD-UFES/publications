module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.vacancies;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.qtd) || !(req.body.reserve)) {
            res.status(400).json(error.parse('vacancies-01', {}));
        } else {
            models.Vacancy
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('vacancies-02', e));
                });
        }
    };

    api.specif = (req, res) => {
        models.Vacancy
            .findById(req.params.id, {
                attributes: {
                    include: []
                }
            })
            .then(vacancy => {
                res.json(vacancy);
            }, e => {
                res.status(500).json(error.parse('vacancies-02', e));
            })
    }

    api.update = (req, res) => {
        models.Vacancy
            .findById(req.params.id)
            .then(vacancy => {
                if(!vacancy) res.status(400).json(error.parse('vacancies-03', {}));
                else
                    vacancy
                        .update(req.body)
                        .then(updatedVacancy => {
                            res.json(updatedVacancy);
                        }, e => res.status(500).json(error.parse('vacancies-02', e)));
            });
    }

    api.delete = (req, res) => {
        models.Vacancy
            .destroy({ where: { id: req.params.id } })
            .then(_ => res.sendStatus(204), e => res.status(500).json(error.parse('vacancies-02', e)));
    }
  
    return api;
  }