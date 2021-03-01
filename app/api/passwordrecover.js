/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.passwordrecover
  const siteConf = require('../../config/site.js')
  const mailConf = require('../../config/mail.js')
  const { validateBodyRequire, validateBodyChange } = require('../validators/passwordrecover')
  const cryptoRandomString = require('crypto-random-string')
  const { verify, sendMail } = require('../helpers/nodemailerSendMail')
  const {
    generateRecoverMessageText,
    generateRecoverMessageHTML,
    generateRecoverMessageSubject
  } = require('../helpers/emailHelpers')

  api.recoverRequire = async (req, res) => {
    const t = await models.sequelize.transaction()
    try {
      //Conferir se tem um body valido
      const validation = validateBodyRequire(req.body)
      if (validation.isValid === false) {
        await t.rollback()
        //send message
        return res.status(400).json(error.parse('recover-400', { ...validation.errors }))
      }

      //Conferir se o usuário existe e é valido
      const includePerson = { model: models.Person, required: false }
      const user = await models.User.findOne({
        include: [includePerson],
        where: { login: req.body.login, authorized: true }
      })
      if (user === null) {
        await t.rollback()
        const message = { login: 'Usuário inativo ou não existe' }
        return res.status(404).json(error.parse('recover-404', message))
      }

      //Se tudo ok, gerar token, passwordRecover e recover URL
      const token = cryptoRandomString({ length: 52 }) + '0' + Date.now().toString(16)
      const passwordRecover = await models.PasswordRecover.create(
        { user_id: user.id, token: token },
        { transaction: t }
      )
      const recoverURL = `${siteConf.frontend_url}/recover`

      //preparar email.
      const mailOptions = {
        from: `${mailConf.auth.user}`,
        to: user.login,
        subject: generateRecoverMessageSubject(),
        text: generateRecoverMessageText(user, recoverURL, passwordRecover),
        html: generateRecoverMessageHTML(user, recoverURL, passwordRecover)
      }

      //tentar enviar o email.
      await verify().catch(err => {
        console.log('Erro ao verificar servidor de email.')
        throw err
      })
      const result = await sendMail(mailOptions).catch(err => {
        console.log('Falha ao enviar email.')
        throw err
      })

      //commit
      await t.commit()

      // enviar resposta ao usuário.
      if (result) {
        console.log(`Email enviado para ${user.login} - `, result.response)
        return res.json({ sended: true, message: `Email enviado para ${user.login}` })
      }

      //if error
    } catch (err) {
      console.log(err)
      await t.rollback()
      const message = { sended: false, message: 'Falha ao enviar o email' }
      return res.status(500).json(error.parse('recover-500', message))
    }
  }

  api.recoverGet = async (req, res) => {
    //includes
    const includeUser = { model: models.User, required: false }

    //get passwordRecover
    let passwordRecover = await models.PasswordRecover.findOne({
      include: [includeUser],
      where: { token: req.params.token }
    })

    //if not passwordRecover, send response error
    if (passwordRecover === null) {
      const message = { finded: false, token: 'Token de recuperação não encontrado' }
      return res.status(404).json(error.parse('recover-404', message))
    }

    //if ok, send response
    return res.json({ finded: true, login: passwordRecover.User.login })
  }

  //recover password change
  api.recoverChange = async (req, res) => {
    const t = await models.sequelize.transaction()
    try {
      //Conferir se tem o body valido
      const validation = validateBodyChange(req.body)
      if (validation.isValid === false) {
        await t.rollback()
        return res.status(400).json(error.parse('recover-400', { ...validation.errors }))
      }

      //includes
      const includeUser = { model: models.User, required: false }

      //Conferir se o token existe e recuperar usuário.
      let passwordRecover = await models.PasswordRecover.findOne({
        include: [includeUser],
        where: { token: req.params.token }
      })
      if (passwordRecover === null) {
        await t.rollback()
        return res.status(404).json(error.parse('recover-404', { token: 'token de recuperação não encontrado' }))
      }

      //Se tudo, ok alterar a senha, apagar tokens
      const user = passwordRecover.User
      const updatedUser = await user.update(req.body, { fields: ['password'], transaction: t })
      await models.PasswordRecover.destroy({
        where: { user_id: [updatedUser.id] },
        individualHooks: true,
        transaction: t
      })

      //commit
      await t.commit()

      //enviar resposta.
      return res.json({ updated: true, message: `Senha de ${updatedUser.login} alterada com sucesso.` })

      //if error
    } catch (err) {
      console.log(err)
      await t.rollback()
      const message = { updated: false, message: 'Falha ao atualizar senha.' }
      return res.status(500).json(error.parse('recover-500', message))
    }
  }

  return api
}
