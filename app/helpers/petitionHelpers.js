/** @format */

const filterPetitionEventId_WithReadPermission = async (user, ieId, db) => {
  const courseId = await findCourseIdByInscriptionEventId(ieId, db)
  const havePermission = user ? hasAnyPermission(user, 'inscription_read', courseId) : null
  return havePermission ? ieId : null
}

const filterPetitionEventIds_WithReadPermission = async (user, ieIds, db) => {
  return Promise.all(ieIds.map(id => filterReadPermissionId(user, id, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}
