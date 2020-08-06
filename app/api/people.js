/** @format */

const { validatePermissionRead } = require('../validators/inscription')

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.people
  const { unknownDevMessage, idNotFoundDevMessage, unauthorizedDevMessage } = require('../helpers/error')
  const { validatePermissionRead } = require('../validators/people.js')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.cpf || !req.body.surname) {
      res.status(400).json(error.parse('people-01', {}))
    } else {
      models.Person.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          if (e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('people-02', e))
          else if (e.name === 'SequelizeValidationError') res.status(400).json(error.parse('people-03', e))
          else res.status(500).json(error.parse('people-04', e))
        }
      )
    }
  }

  //People read
  api.read = async (req, res) => {
    try {
      const toRead = await models.Person.findByPk(req.params.id)

      //verify valid id
      if (!toRead) {
        return res.status(400).json(error.parse('people-400', idNotFoundDevMessage()))
      }

      //checar permissão para ler people
      //preciso estar logado. (para ter req.user)
      //Se é o people do meu usuário ou eu tenho permissão eu posso.
      const permissionErrors = await validatePermissionRead(toRead, req.user)
      if (permissionErrors) {
        return res.status(401).json(error.parse('people-401', unauthorizedDevMessage(permissionErrors)))
      }

      //return result
      return res.json(toRead)

      //if error
    } catch (err) {
      return res.status(500).json(error.parse('people-500', unknownDevMessage(err)))
    }
  }

  api.update = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]')) {
      res.status(400).json(error.parse('people-01', {}))
    } else {
      models.Person.findOne({ where: { user_id: req.params.id } }).then(
        person => {
          if (!person) res.status(400).json(error.parse('people-05', {}))
          else
            person.update(req.body).then(
              updatedPerson => {
                res.json(updatedPerson)
              },
              e => res.status(500).json(error.parse('people-04', e))
            )
        },
        e => res.status(500).json(error.parse('people-04', e))
      )
    }
  }

  api.options = (req, res) => {
    res.json({
      ethnicity: models.Person.rawAttributes.ethnicity.type.options,
      civilStatus: models.Person.rawAttributes.civilStatus.type.options,
      gender: models.Person.rawAttributes.gender.type.options
    })
  }

  return api
}
