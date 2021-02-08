/** @format */

module.exports = app => {
  const api = {}
  const models = require('../models')
  const db = require('../models/index')
  const error = app.errors.me

  // const { validationDevMessage } = require('../helpers/error')

  api.me = (req, res) => {
    models.User.findById(req.user.id, {
      include: [
        {
          model: models.UserRole,
          required: false,
          include: [
            {
              model: models.RoleType,
              required: false,
              include: [
                {
                  model: models.Permission,
                  required: false
                }
              ]
            },
            {
              model: models.Course,
              required: false
            }
          ]
        },
        {
          model: models.Person,
          require: false
        }
      ]
    }).then(user => res.send(user))
  }

  api.update = (req, res) => {
    let hasPerson = false
    let hasUser = false
    let User = {}
    let Person = {}

    if (req.body.User) {
      User = req.body.User
      hasUser = true
    }

    if (req.body.Person) {
      Person = req.body.Person
      Person.user_id = req.user.id
      hasPerson = true
    }

    // //validation
    // const validationErrors = validateBodyPerson(req, models, toDelete)
    // if (validationErrors) {
    //   return res.status(400).json(error.parse('me-400', validationDevMessage(validationErrors)))
    // }

    db.sequelize.transaction().then(t => {
      return Promise.all([
        models.User.findById(req.user.id, { transaction: t }).then(user => {
          if (hasUser) return user.update(User, { fields: Object.keys(User), transaction: t })
        }),
        models.Person.findOne({ where: { user_id: req.user.id }, transaction: t }).then(person => {
          if (hasPerson)
            if (person) return person.update(Person, { fields: Object.keys(Person), transaction: t })
            else return models.Person.create(Person, { transaction: t })
        })
      ])
        .then(() => {
          t.commit().then(() => res.sendStatus(200))
        })
        .catch(err => {
          t.rollback().then(() => {
            if (err.name === 'SequelizeValidationError') {
              console.log('\n', err, '\n')
              res.status(400).json(error.parse('me-01', err))
            }
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('me-02', err))
            else res.status(500).json(error.parse('me-03', err))
          })
        })
    })
  }
  return api
}
