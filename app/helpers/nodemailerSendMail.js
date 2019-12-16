const nodemailer = require('nodemailer')

const mailConfig = require('../../config/mail')

const transporter = nodemailer.createTransport(mailConfig)

const sendMail = mailOptions => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) return reject(error)
      return resolve(info)
    })
  })
}

module.exports = { sendMail }
