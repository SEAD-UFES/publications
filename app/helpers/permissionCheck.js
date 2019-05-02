'use strict'

const hasRoles = user => 
  Boolean(user.UserRoles.length)

const isAdmin = user => 
  user.UserRoles
    .map(x => x.RoleType.name)
    .includes('Administrador')

const hasGlobalPermission = (user, permission) =>
  user.UserRoles
    .filter(r => r.RoleType.global)
    .some(r => r.RoleType.Permissions
      .map(p => p.name)
      .includes(permission))

const allowedCourseIds = (user, permission) =>
  user.UserRoles
    .filter(x => x.Course)
    .map(x => ({
      courseId: x.Course.id,
      canListCourses: x.RoleType.Permissions
        .map(x => x.name)
        .includes(permission)
      }))
    .filter(x => x.canListCourses)
    .map(x => x.courseId)

module.exports = { hasRoles, isAdmin, hasGlobalPermission, allowedCourseIds }

