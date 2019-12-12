/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  // const error = app.errors.userVerificationTokens

  api.send = async (req, res) => {
    // user is already verified
    if (req.user && req.user.verifiedAt) return res.json({ message: 'usuário já verificado' })

    try {
      await models.UserVerificationToken.destroy({ where: { user_id: req.user.id } }) // delete old tokens
      const newToken = await models.UserVerificationToken.create({ user_id: req.user.id }) // create new one

      // send it via email
      // answer with "verification mail sent"
      //res.json({ token: newToken, sendTo: req.user.login })
      res.json({ message: `verificação enviada para ${req.user.login}` })
    } catch (e) {
      res.json({ message: 'deu ruim na hora de criar o token', user: req.user })
    }
  }

  // allow user to check if token is valid, changes user to valited if valid
  // otherwise sends user an error
  api.verify = async (req, res) => {
    const { token } = req.params

    // verify if the token exists
    try {
      const foundToken = await models.UserVerificationToken.findOne({ where: { token } })

      if (foundToken) {
        // change user.isVerified to true
        const user = await models.User.findByPk(foundToken.user_id)
        await user.update({ verifiedAt: new Date() })

        // delete token
        await models.UserVerificationToken.destroy({ where: { user_id: user.id } }) // delete old tokens

        //respond with "email is now verified"
        res.json({ message: 'usuário verificado' })
      } else {
        res.json({ message: 'link inválido' })
      }
    } catch (e) {
      res.json({ message: 'retornar que deu erro na hora verificar o token' })
    }
  }

  return api
}
