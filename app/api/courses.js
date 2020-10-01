/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.courses
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.name || !req.body.description) {
      res.status(400).json(error.parse('courses-01', {}))
    } else {
      models.Course.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          res.status(500).json(error.parse('courses-02', e))
        }
      )
    }
  }

  api.update = (req, res) => {
    models.Course.findById(req.params.id).then(
      course => {
        if (!course) res.status(400).json(error.parse('courses-03', {}))
        else
          course.update(req.body, { fields: Object.keys(req.body) }).then(
            updatedCourse => res.json(updatedCourse),
            e => res.status(500).json(error.parse('courses-02', e))
          )
      },
      e => res.status(500).json(error.parse('courses-02', e))
    )
  }

  api.specific = (req, res) => {
    models.Course.findOne({
      where: { id: req.params.id },
      //          include: [models.GraduationType]
      include: [{ model: models.GraduationType }]
    }).then(
      course => {
        if (!course) res.status(400).json(error.parse('courses-03', {}))
        else res.json(course)
      },
      e => res.status(500).json(error.parse('courses-02', e))
    )
  }

  api.find = async (req, res) => {
    const findCourseByProcess = async process_id => {
      const process = await models.SelectiveProcess.findById(process_id)
      const course = await models.Course.findById(process.course_id, {
        include: [models.GraduationType]
      })
      return course
    }

    const findCourseByCall = async call_id => {
      const call = await models.Call.findById(call_id)
      const course = await findCourseByProcess(call.selectiveProcess_id)
      return course
    }

    const findCourseByVacancy = async vacancy_id => {
      const vacancy = await models.Vacancy.findById(vacancy_id)
      const course = await findCourseByCall(vacancy.call_id)
      return course
    }

    //Buscar por process
    if (req.query.process_id) {
      try {
        const course = await findCourseByProcess(req.query.process_id)
        res.json(course)
      } catch (err) {
        res.status(500).json(error.parse('courses-03', err.toString()))
      }
    }

    //Buscar por call
    else if (req.query.call_id) {
      try {
        const course = await findCourseByCall(req.query.call_id)
        res.json(course)
      } catch (err) {
        res.status(500).json(error.parse('courses-03', err.toString()))
      }
    }

    //Buscar por vacancy
    else if (req.query.vacancy_id) {
      try {
        const course = await findCourseByVacancy(req.query.vacancy_id)
        res.json(course)
      } catch (err) {
        res.status(500).json(error.parse('courses-03', err.toString()))
      }
    }

    //Casos não previstos
    else res.status(500).json(error.parse('courses-02', 'Caso não previsto pela api.'))
  }

  //Course delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Course.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('course-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Course.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('course-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('course-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.Course.findAll({
      include: [models.GraduationType]
    }).then(
      courses => {
        res.json(courses)
      },
      e => {
        res.status(500).json(error.parse('courses-02', e))
      }
    )
  }

  return api
}
