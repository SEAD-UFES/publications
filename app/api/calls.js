/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const api = {}
  const error = app.errors.calls

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.number) {
      res.status(400).json(error.parse('calls-01', {}))
    } else {
      // assert req.body.endingDate > req.body.openingDate /* is this a date object? does it have to be? */
      let options = {
        where: {
          [Sequelize.Op.or]: {
            openingDate: {
              [Sequelize.Op.gte]: req.body.openingDate,
              [Sequelize.Op.lte]: req.body.endingDate
            },
            endingDate: {
              [Sequelize.Op.gte]: req.body.openingDate,
              [Sequelize.Op.lte]: req.body.endingDate
            }
          },
          selectiveProcess_id: req.body.selectiveProcess_id
        }
      }
      models.Call.findOne(options).then(result => {
        if (result) {
          res.status(400).json(error.parse('calls-05', result))
        } else {
          models.Call.create(req.body).then(
            call => {
              res.status(201).json({
                id: call.id
              })
            },
            e => {
              if (e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('calls-03', e))
              else res.status(500).json(error.parse('calls-02', {}))
            }
          )
        }
      })
    }
  }

  api.specific = (req, res) => {
    const vacancy_structure = {
      model: models.Vacancy,
      required: false,
      include: [
        {
          model: models.Assignment,
          required: false
        },
        {
          model: models.Restriction,
          required: false
        },
        {
          model: models.Region,
          required: false
        }
      ]
    }

    const call_structure = {
      include: [vacancy_structure],
      order: [[models.Vacancy, 'createdAt', 'ASC']]
    }

    //Find and return call
    models.Call.findById(req.params.id, call_structure).then(
      call => {
        res.json(call)
      },
      e => {
        res.status(500).json(error.parse('calls-02', e))
      }
    )
  }

  api.update = (req, res) => {
    models.Call.findById(req.params.id).then(
      call => {
        call.update(req.body, { fields: Object.keys(req.body) }).then(
          updatedCall => {
            res.json(updatedCall)
          },
          e => {
            if (e.name === 'SequelizeUniqueConstraintError') {
              res.status(400).json(error.parse('calls-02', e))
            } else {
              res.status(500).json(error.parse('calls-02', e))
            }
          }
        )
      },
      e => {
        res.status(500).json(error.parse('calls-02', e))
      }
    )
  }

  api.delete = (req, res) => {
    models.Call.destroy({ where: { id: req.params.id } }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('calls-04'))
      }
    )
  }

  return api
}
