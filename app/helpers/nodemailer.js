const nodemailer = require('nodemailer')

const mailConfig = require('../../config/mail')
const util = require('util')

// const sendEmail = mailOptions => {
const transporter = nodemailer.createTransport(mailConfig)

const sendMailPromise = util.promisify(transporter.sendMail)

// transporter.sendMail(mailOptions, function(error, info) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log('Email enviado: ' + info.response)
//   }
// })

// }

const sendMail = mailOptions => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) return reject(error)
      return resolve(info)
    })
  })
}

module.exports = { sendMailPromise, sendMail }
