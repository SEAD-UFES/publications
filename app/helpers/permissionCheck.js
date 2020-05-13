/** @format */

'use strict'

const hasRoles = user => Boolean(user.UserRoles.length)

const isAdmin = user => user.UserRoles.map(x => x.RoleType.name).includes('Administrador')

const hasGlobalPermission = (user, permission) =>
  user.UserRoles.filter(r => r.RoleType.global).some(r => r.RoleType.Permissions.map(p => p.name).includes(permission))

const hasCoursePermission = (user, permission, course_id) => {
  const courseUserRoles = user.UserRoles.filter(ur => ur.course_id === course_id && ur.RoleType.global === false)
  const havePermission = courseUserRoles.some(ur => ur.RoleType.Permission.map(p => p.name).includes(permission))
  return havePermission
}

const hasAnyPermission = (user, permission, course_id) => {
  if (isAdmin(user)) return true
  if (hasGlobalPermission(user, permission)) return true
  if (hasCoursePermission(user, permission, course_id)) return true
  return false
}

const allowedCourseIds = (user, permission) =>
  user.UserRoles.filter(x => x.Course)
    .map(x => ({
      courseId: x.Course.id,
      canListCourses: x.RoleType.Permissions.map(x => x.name).includes(permission)
    }))
    .filter(x => x.canListCourses)
    .map(x => x.courseId)

module.exports = { hasRoles, isAdmin, hasGlobalPermission, allowedCourseIds, hasCoursePermission, hasAnyPermission }
