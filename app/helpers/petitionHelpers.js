/** @format */

const { hasAnyPermission } = require('./permissionCheck')

const getCourseIds_from_Petitions = petitions => {
  const courseIds = petitions.map(
    petition => petition.Inscription.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
  ).map
  const uniqueCourseIds = [...new Set(courseIds)]
  return uniqueCourseIds
}

const filterCourseIds_withPermission = (user, permission, courseIds) => {
  const courseIds_withPermission = courseIds.reduce((acc, curr, idx, []) => {
    if (hasAnyPermission(user, permission, curr)) acc.push(curr)
    return acc
  })
  return courseIds_withPermission
}

const getPetitionIds_withCourseIds = (petitions, courseIds) => {
  const petitionIds = petitions.reduce((acc, petition, idx, []) => {
    const petition_courseId = petition.Inscription.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
    if (courseIds.includes(petition_courseId)) acc.push(petition.id)
    return acc
  })
  return petitionIds
}

const getPetitionIds_OwnedByUser = (petitions, person) => {
  const petitionIds = petitions.reduce((acc, petition, idx, []) => {
    const personId_fromPetition = petition.Inscription.person_id
    if (person.id === personId_fromPetition) acc.push(petition.id)
    return acc
  })
  return petitionIds
}

module.exports = {
  getCourseIds_from_Petitions,
  filterCourseIds_withPermission,
  getPetitionIds_withCourseIds,
  getPetitionIds_OwnedByUser
}
