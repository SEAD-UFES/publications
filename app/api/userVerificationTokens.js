/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.userVerificationTokens

  const { sendVerificationEmail } = require('../helpers/nodemailer.js')

  api.send = async (req, res) => {
    // user is already verified
    if (req.user && req.user.verifiedAt) {
      return res.status(400).json(error.parse('userVerificationTokens-04'))
    }

    try {
      const userEmail = req.user.login
      const userName = req.user.Person && req.user.Person.name

      await models.UserVerificationToken.destroy({ where: { user_id: req.user.id } }) // delete old tokens
      const { token } = await models.UserVerificationToken.create({ user_id: req.user.id }) // create new one

      // send verification via email
      const sentMail = await sendVerificationEmail(userName, userEmail, token)
      console.log(sentMail)

      // answer with "verification mail sent"
      res.status(201).json({ message: `Verificação enviada para ${req.user.login}.` })
    } catch (e) {
      res.status(400).json(error.parse('userVerificationTokens-02', e))
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
        await user.update({ verifiedAt: new Date(), authorized: true })

        // delete token
        await models.UserVerificationToken.destroy({ where: { user_id: user.id } }) // delete old tokens

        //respond with "email is now verified"
        res.status(201).json({ message: 'Usuário verificado com sucesso.' })
      } else {
        res.status(400).json(error.parse('userVerificationTokens-03')) // invalid token
      }
    } catch (e) {
      res.status(400).json(error.parse('userVerificationTokens-02'))
    }
  }

  return api
}
