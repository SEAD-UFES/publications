/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.register
  const db = require('../models/index')
  const { validationDevMessage, unknownDevMessage } = require('../helpers/error')
  const { validateBody } = require('../validators/register.js')

  // api.create = async (req, res) => {
  //   if (!(Object.prototype.toString.call(req.body) === '[object Object]') || !req.body.cpf || !req.body.User.login) {
  //     res.status(400).json(error.parse('register-01', {}))
  //   } else {
  //     req.body.User.authorized = 0
  //     models.Person.findOne({
  //       where: {
  //         cpf: req.body.cpf
  //       }
  //     }).then(p => {
  //       models.User.findOne({
  //         where: {
  //           login: req.body.User.login
  //         }
  //       }).then(u => {
  //         if (p || u) {
  //           let e = {
  //             cpf: 'Ok.',
  //             login: 'Ok.'
  //           }
  //           p ? (e.cpf = 'CPF já cadastrado.') : delete e.cpf
  //           u ? (e.login = 'Login já cadastrado.') : delete e.login
  //           res.status(400).json(error.parse('register-05', e))
  //         } else {
  //           db.sequelize.transaction(t => {
  //             return models.Person.create(req.body, {
  //               include: [
  //                 {
  //                   model: models.User
  //                 }
  //               ],
  //               transaction: t
  //             })
  //               .then(person => {
  //                 res.status(201).json({
  //                   id: person.User.id
  //                 })
  //               })
  //               .catch(e => {
  //                 t.rollback()
  //                 if (e.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('register-02', e))
  //                 if (e.name === 'SequelizeValidationError') res.status(400).json(error.parse('register-03', e))
  //                 else res.status(500).json(error.parse('register-04', e))
  //               })
  //           })
  //         }
  //       })
  //     })
  //   }
  // }

  api.createV2 = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
      //validation and rules
      const validationErrors = await validateBody(req.body, models, 'create')
      if (validationErrors) {
        await t.rollback()
        return res.status(400).json(error.parse('register-400', validationDevMessage(validationErrors)))
      }

      //permission
      //no permission required.

      //operation
      req.body.User.authorized = 0 //user need to verify first?
      const user = await db.User.create(req.body.User, { transaction: t })
      req.body.Person.user_id = user.id
      await db.Person.create(req.body.Person, { transaction: t })
      await t.commit()
      return res.status(201).json({ id: user.id })

      //if error
    } catch (err) {
      console.log(err)
      await t.rollback()
      return res.status(500).json(error.parse('register-500', unknownDevMessage(err)))
    }
  }

  return api
}
