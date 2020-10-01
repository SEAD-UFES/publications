/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.graduationTypes
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.name) {
      res.status(400).json(error.parse('graduationTypes-01', {}))
    } else {
      models.GraduationType.create(req.body).then(
        graduationType => {
          res.status(201).json(graduationType)
        },
        e => {
          if (e.name === 'SequelizeUniqueConstraintError') res.status(500).json(error.parse('graduationTypes-04'))
          else res.status(500).json(error.parse('graduationTypes-02', e))
        }
      )
    }
  }

  api.specific = (req, res) => {
    models.GraduationType.findById(req.params.id).then(graduationType => {
      if (!graduationType) {
        res.status(400).json(error.parse('graduationType-03', e))
      } else {
        res.json(graduationType)
      }
    })
  }

  api.update = (req, res) => {
    models.GraduationType.findById(req.params.id).then(graduationType => {
      if (!graduationType) {
        res.status(400).json(error.parse('graduationTypes-03', {}))
      } else {
        graduationType.update(req.body, { fields: Object.keys(req.body) }).then(
          updated => res.json(updated),
          e => {
            if (e.name === 'SequelizeUniqueConstraintError') res.status(500).json(error.parse('graduationTypes-04'))
            else res.status(500).json(error.parse('graduationTypes-02', e))
          }
        )
      }
    })
  }

  //Action delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.GraduationType.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('graduationType-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.GraduationType.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('graduationType-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('graduationType-500', unknownDevMessage(err)))
    }
  }

  api.list = (req, res) => {
    models.GraduationType.findAll({}).then(
      graduationTypes => {
        res.json(graduationTypes)
      },
      e => {
        res.status(500).json(error.parse('graduationTypes-02', e))
      }
    )
  }

  return api
}
