/** @format */

const moment = require('moment')

const generateRecoverMessageSubject = () => {
  const subject = `SPS SEAD - Requisição de troca de senha. - ${moment().format('YYYY/MM/DD HH:mm:ss')}`
  return subject
}

const generateRecoverMessageText = (user, recoverURL, passwordRecover) => {
  const text = `
    Requisição de troca de senha\n
    Olá ${user.Person ? user.Person.name : user.login}\n
    Você nos disse que esqueceu sua senha. Se você realmente esqueceu, utilize o link abaixo para redefini-la.\n
    Para redefinir sua senha, acesse:\n
    ${recoverURL}/${passwordRecover.token}\n
    Este e-mail é automático, favor não responder!\n
    `
  return text
}

const generateRecoverMessageHTML = (user, recoverURL, passwordRecover) => {
  const html = `
    <h1>Requisição de troca de senha</h1>
    <p>Olá ${user.Person ? user.Person.name : user.login}</p>
    <p>Você nos disse que esqueceu sua senha. Se você realmente esqueceu, utilize o link abaixo para redefini-la.</p>
    <p>
      Para redefinir sua senha,
      <a href="${recoverURL}/${passwordRecover.token}" target="_blank" rel="noopener noreferrer">clique aqui</a>
    </p>
    <p>Este e-mail é automático, favor não responder!</p>
    `
  return html
}

module.exports = { generateRecoverMessageSubject, generateRecoverMessageText, generateRecoverMessageHTML }
