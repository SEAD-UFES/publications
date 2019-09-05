/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const api = {}
  const error = app.errors.notices
  const { validate } = require('../validators/notices.js')

  const { isEmpty } = require('lodash')

  api.create = async (req, res, next) => {
    let errors
    try {
      errors = await validate(req)
    } catch (e) {
      res.status(400).json(error.parse('notices-02', 'Error during validation.'))
      return next()
    }

    if (isEmpty(errors)) {
      try {
        const createdNotice = await models.Notice.create(req.body)
        res.status(201).json({ id: createdNotice.id })
        return next()
      } catch (e) {
        res.status(400).json(error.parse('notices-05', 'Error trying to create new Notice.'))
        return next()
      }
    } else {
      /* fail, send validation errors */
      res.status(400).json(error.parse('notices-01', { errors }))
      return next()
    }
  }

  api.specific = (req, res) => {}

  api.update = async (req, res) => {}

  api.delete = (req, res) => {
    models.Notice.destroy({ where: { id: req.params.id } }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('notices-04'))
      }
    )
  }

  return api
}
