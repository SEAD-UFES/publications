/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.users
  const { idNotFoundDevMessage } = require('../helpers/error')

  api.create = (req, res) => {
    if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.login || !req.body.password) {
      res.status(400).json(error.parse('users-01', {}))
    } else {
      models.User.create(req.body).then(
        _ => {
          res.sendStatus(201)
        },
        e => {
          if (e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('users-02', e))
          else if (e.name === 'SequelizeValidationError') res.status(400).json(error.parse('users-03', e))
          else res.status(500).json(error.parse('users-04', e))
        }
      )
    }
  }

  api.list = (req, res) => {
    req.query = {
      page: req.query.page * 1 || 1,
      limit: (req.query.limit * 1 <= 100 ? req.query.limit * 1 : 100) || 5
    }
    models.User.findAll({
      offset: (req.query.page - 1) * req.query.limit,
      limit: req.query.limit
    }).then(
      users => {
        Promise.all(
          users.map(u => {
            return models.Person.findOne({
              where: {
                user_id: u.id
              }
            }).then(p => {
              if (!p) return u
              else {
                u = u.toJSON()
                u.Person = p.toJSON()
                return u
              }
            })
          })
        ).then(result => {
          models.User.count().then(
            count =>
              res.json({
                info: {
                  count: count,
                  currentPage: req.query.page,
                  numberOfPages: Math.ceil(count / req.query.limit)
                },
                users: result
              }),
            e => res.status(500).json(error.parse('users-04', e))
          )
        })
      },
      e => {
        res.status(500).json(error.parse('users-04', e))
      }
    )
  }

  api.minimal = (req, res) => {
    models.User.findAll({
      attributes: ['id', 'login'],
      order: ['login']
    }).then(
      users => {
        res.json(users)
      },
      e => {
        res.status(500).json(error.parse('users-04', e))
      }
    )
  }

  api.specific = (req, res) => {
    models.User.findById(req.params.id).then(
      user => {
        if (!user) res.status(400).json(error.parse('users-05', {}))
        else {
          models.Person.findOne({
            where: {
              user_id: user.id
            }
          }).then(person => {
            if (person) {
              user = user.toJSON()
              user.Person = person.toJSON()
            }
            res.json(user)
          })
        }
      },
      e => {
        res.status(500).json(error.parse('users-04', e))
      }
    )
  }

  api.update = (req, res) => {
    models.User.findById(req.params.id).then(
      user => {
        user
          .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(
            updatedUser => {
              res.json(updatedUser)
            },
            e => {
              if (e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('users-06', e))
              else res.status(500).json(error.parse('users-04', e))
            }
          )
      },
      e => res.status(500).json(error.parse('users-04', e))
    )
  }

  // api.delete = (req, res) => {
  //   models.User.destroy({
  //     where: {
  //       id: req.params.id,
  //     },
  //   }).then(
  //     (_) => {
  //       res.sendStatus(204)
  //     },
  //     (e) => {
  //       res.status(500).json(error.parse('users-04', e))
  //     }
  //   )
  // }

  api.delete = async (req, res) => {
    const toDelete = await models.User.findByPk(req.params.id)

    //verify valid id
    if (!toDelete) {
      return res.status(400).json(error.parse('user-400', idNotFoundDevMessage()))
    }

    //try to delete
    try {
      await models.User.destroy({ where: { id: req.params.id }, individualHooks: true }).then(_ => res.sendStatus(204))
    } catch (e) {
      if (e.name === 'ForbbidenDeletionError') return res.status(403).json(error.parse('user-403', e))
      return res.status(500).json(error.parse('user-500', e))
    }
  }

  return api
}
