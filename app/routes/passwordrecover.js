module.exports = app => {
  const api = app.api.passwordrecover

  //post login to recover pass. Send a token to user via email. Return status message
  app.route(`${app.get('recoverApiRoute')}`).post(api.recoverRequire)

  //post new password to the user. Return status message
  app.route(`${app.get('recoverApiRoute')}/:token`).post(api.recoverChange)
}
