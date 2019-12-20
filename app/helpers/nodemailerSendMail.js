/** @format */

const nodemailer = require('nodemailer')

const mailConfig = require('../../config/mail')

const apiAddress = 'http://localhost:3000/v1/verify/'

const transporter = nodemailer.createTransport(mailConfig)

const sendMail = mailOptions => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) return reject(error)
      return resolve(info)
    })
  })
}

const sendVerificationEmail = async (userName, userEmail, verificationToken) => {
  const htmlMessage = `
    <h1>Verificação de E-mail (Seleção SEAD UFES)</h1>
    <p>Olá ${userName || userEmail},</p>
    <p>Para confirmar sua conta de e-mail, por favor acesse o link abaixo:</p>
    <p>
      <a href="${apiAddress}${verificationToken}"
        target="_blank" 
        rel="noopener noreferrer">Verificação (o link será aberto em uma nova página)</a>
    </p>
    <p>Este e-mail é automático, favor não responder.</p>
  `
  const textMessage = `
    Verificação de E-mail (Seleção SEAD/UFES)

    Olá ${userName || userEmail},

    Para confirmar sua conta de e-mail, por favor acesse o link abaixo:
    ${apiAddress}${verificationToken}

    Este e-mail é automático, favor não responder.
  `

  const mailOptions = {
    from: 'no-reply-spss@ufes.br',
    to: userEmail,
    subject: 'Seleção SEAD - Confirmação de E-mail',
    html: htmlMessage,
    text: textMessage
  }

  return await sendMail(mailOptions)
}

module.exports = { sendMail, sendVerificationEmail }
