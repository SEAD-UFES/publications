module.exports = app => {
    const api = app.api.rolePermissions;
    const authApi = app.api.auth;

    app.route(app.get('rolePermissionApiRoute'))
        .post(authApi.authenticationRequired, authApi.adminRequired, api.create)
        .get(authApi.authenticationRequired, authApi.adminRequired, api.list)
    
    app.route(app.get('rolePermissionApiRoute') + "/:id")
        .get(authApi.authenticationRequired, authApi.adminRequired, api.specific)
        .delete(authApi.authenticationRequired, authApi.adminRequired, api.delete)
}
  
