/** @format */

module.exports = app => {
  const models = require('../models')
  const api = {}
  const error = app.errors.passwordrecover

  const { validateBody } = require('../validators/passwordrecover')
  const cryptoRandomString = require('crypto-random-string')
  const { sendMail } = require('../helpers/nodemailerSendMail')

  //revover password require
  api.recoverRequire = async (req, res) => {
    //Conferir se tem um body valido
    const validation = validateBody(req.body)
    if (validation.isValid === false) {
      return res.status(400).json(error.parse('recover-400', { ...validation.errros }))
    }

    //Conferir se o usuário existe e é valido
    let includes = [{ model: models.Person, required: false }]
    let user = await models.User.findOne({ include: includes, where: { login: req.body.login, authorized: true } })
    if (user === null) {
      return res.status(400).json(error.parse('recover-404', { login: 'Usuário inativo ou não existe' }))
    }

    //Se tudo ok, gerar e enviar token
    const token = cryptoRandomString({ length: 52 }) + '0' + Date.now().toString(16)
    const passwordRecover = await models.PasswordRecover.create({ user_id: user.id, token: token })

    const text = `
      Requisição de troca de senha\n
      Olá ${user.Person ? user.Person.name : user.login}\n
      Você nos disse que esqueceu sua senha. Se você realmente esqueceu, utilize o link abaixo para redefini-la.\n
      Para redefinir sua senha, acesse:\n
      http://localhost:5000/recovery/${passwordRecover.token}\n
      Este e-mail é automático, favor não responder!\n
      `

    const html = `
      <h1>Requisição de troca de senha</h1>
      <p>Olá ${user.Person ? user.Person.name : user.login}</p>
      <p>Você nos disse que esqueceu sua senha. Se você realmente esqueceu, utilize o link abaixo para redefini-la.</p>
      <p>
        Para redefinir sua senha,
        <a href="http://localhost:5000/recovery/${
          passwordRecover.token
        }" target="_blank" rel="noopener noreferrer">clique aqui</a>
      </p>
      <p>Este e-mail é automático, favor não responder!</p>
      `

    mailOptions = {
      from: '1e3a18137a-8f25af@inbox.mailtrap.io',
      to: user.login,
      subject: 'SPS SEAD - Requisição de troca de senha.',
      text: text,
      html: html
    }

    sendMail(mailOptions)
      .then(info => {
        console.log(`Email enviado para ${user.login} - `, info.response)
        return res.json({ message: `Email enviado para ${user.login}` })
      })
      .catch(error => {
        console.log(error)
        return res.status(400).json(error.parse('recover-500', { sended: false, message: 'falha ao enviar o email' }))
      })
  }

  //recover password change
  api.recoverChange = (req, res) => {
    return res.json({ result: 'route password change working' })
  }

  return api
}
