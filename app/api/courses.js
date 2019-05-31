module.exports = app => {
    const models = require('../models');
    const api = {};
    const error = app.errors.courses;
  
    api.create = (req, res) => {
        if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.name) || !(req.body.description)) {
            res.status(400).json(error.parse('courses-01', {}));
        } else {
            models.Course
                .create(req.body)
                .then(_ => {
                    res.sendStatus(201)
                }, e => {
                    res.status(500).json(error.parse('courses-02', e));
                });
        }
    };

    api.list = (req, res) => {
        models.Course
          .findAll({
            include: [models.GraduationType]
          })
          .then(courses => {
            res.json(courses);
          }, e => {
            res.status(500).json(error.parse('courses-02', e));
          });
    }

    api.update = (req, res) => {
      models.Course
        .findById(req.params.id)
        .then(course => {
            if(!course) res.status(400).json(error.parse('courses-03', {}));
            else course.update(req.body, {fields: Object.keys(req.body)})
                       .then(updatedCourse => res.json(updatedCourse), e => res.status(500).json(error.parse('courses-02', e)));
         }, e => res.status(500).json(error.parse('courses-02', e)));
    }

    api.specific = (req, res) => {
      models.Course
        .findOne({
          where: {id: req.params.id},
          //          include: [models.GraduationType]
          include: [
            { model: models.GraduationType }
          ]
        })

            .then(course => {
                if(!course) res.status(400).json(error.parse('courses-03', {}));
                else res.json(course);
            }, e => res.status(500).json(error.parse('courses-02', e)));
    }

    api.delete = (req, res) => {
        models.Course
            .destroy({ where: { id: req.params.id } })
            .then(_ => res.sendStatus(204), e => res.status(500).json(error.parse('courses-02', e)));
    }
  
    return api;
  }
