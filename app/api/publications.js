/** @format */

module.exports = app => {
  const Sequelize = require('sequelize')
  const models = require('../models')
  const path = require('path')
  const api = {}
  const error = app.errors.publications
  const { unknownDevMessage, idNotFoundDevMessage, forbbidenDeletionDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (
      !(Object.prototype.toString.call(req.body) === '[object Object]') ||
      !req.body.selectiveProcess_id ||
      !req.body.publicationType_id
    ) {
      res.status(400).json(error.parse('publications-01', {}))
    } else {
      models.Publication.create(req.body).then(
        publication => {
          res.status(201).json({
            id: publication.id
          })
        },
        e => {
          res.status(500).json(error.parse('publications-02', e))
        }
      )
    }
  }

  api.specific = (req, res) => {
    models.Publication.findById(req.params.id).then(
      publication => {
        res.json(publication)
      },
      e => {
        res.status(500).json(error.parse('publications-02', e))
      }
    )
  }

  api.update = (req, res) => {
    models.Publication.findById(req.params.id).then(
      publication => {
        publication.update(req.body, { fields: Object.keys(req.body) }).then(
          updatedPublication => {
            res.json(updatedPublication)
          },
          e => {
            res.status(500).json(error.parse('publications-02', e))
          }
        )
      },
      e => {
        res.status(500).json(error.parse('publications-02', e))
      }
    )
  }

  api.delete = (req, res) => {
    models.Publication.destroy({ where: { id: req.params.id } }).then(
      _ => {
        res.sendStatus(204)
      },
      e => {
        res.status(500).json(error.parse('publications-03'))
      }
    )
  }

  //Publication delete
  api.delete = async (req, res) => {
    try {
      const toDelete = await models.Publication.findByPk(req.params.id)

      //verify valid id
      if (!toDelete) {
        return res.status(400).json(error.parse('publication-400', idNotFoundDevMessage()))
      }

      //try to delete
      await models.Publication.destroy({
        where: { id: req.params.id },
        individualHooks: true
      }).then(_ => res.sendStatus(204))

      //if error
    } catch (err) {
      if (err.name === 'ForbbidenDeletionError')
        return res.status(403).json(error.parse('publication-403', forbbidenDeletionDevMessage(err)))
      return res.status(500).json(error.parse('publication-500', unknownDevMessage(err)))
    }
  }

  api.download = (req, res) => {
    const file = req.params.file
    const fileLocation = path.join('./public/files/', file)
    const publicFiles = __dirname + '../../../public/files'

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=' + file)
    res.sendFile(file, { root: publicFiles })
  }

  return api
}
