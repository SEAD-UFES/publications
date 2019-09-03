module.exports = app => {
  const api = app.api.courses
  const authApi = app.api.auth

  app
    .route(app.get('courseApiRoute'))
    .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
    .get(authApi.authenticationRequired, api.list)

  app.route(app.get('courseApiRoute') + '/find').get(api.find)

  app
    .route(app.get('courseApiRoute') + '/:id')
    .put(authApi.authenticationRequired, authApi.adminRequired, api.update)
    .get(authApi.authenticationRequired, api.specific)
    .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
