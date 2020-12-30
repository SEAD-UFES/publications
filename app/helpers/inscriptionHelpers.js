/** @format */

const { hasAnyPermission } = require('./permissionCheck')

const checkIsUserInscription = async (inscription, user, db) => {
  const userPerson = await user.getPerson()
  if (!userPerson) return false

  const userPersonId = userPerson.id
  const inscriptionPersonId = inscription.person_id

  if (userPersonId === inscriptionPersonId) return true
  return false
}

const filter_Inscriptions_VisibleForThisUser = (inscriptions, user) => {
  //isolar os processos para checar
  const processesToCheck = inscriptions.reduce((acc, curr) => {
    const process = curr.InscriptionEvent.Calendar.Call.SelectiveProcess
    if (!acc.find(pro => pro.id === process.id)) acc = [...acc, process]
    return acc
  }, [])

  //para cada processo, isolar os visiveis para esse usuário.
  const visibleProcessIds = processesToCheck.reduce((acc, curr) => {
    const haveProcessPermission = user ? hasAnyPermission(user, 'selectiveprocess_read', curr.course_id) : false
    if (curr.visible || haveProcessPermission) acc = [...acc, curr.id]
    return acc
  }, [])

  //filtrar as inscrições que pertencem a processos visiveis
  const visibleInscriptions = inscriptions.reduce((acc, curr) => {
    const processId = curr.InscriptionEvent.Calendar.Call.SelectiveProcess.id
    if (visibleProcessIds.includes(processId)) acc = [...acc, curr]
    return acc
  }, [])

  return visibleInscriptions
}

const filter_Inscriptions_OwnedByPerson = (inscriptions, person_id) => {
  const inscriptionsOfThisPerson = inscriptions.reduce((acc, curr) => {
    if (curr.person_id === person_id) acc = [...acc, process]
    return acc
  }, [])
  return inscriptionsOfThisPerson
}

const getCourseIds_from_Inscriptions = inscriptions => {
  const courseIds = inscriptions.map(
    inscription => inscription.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
  )
  const uniqueCourseIds = [...new Set(courseIds)]
  return uniqueCourseIds
}

const filterCourseIds_withPermission = (user, permission, courseIds) => {
  const courseIds_withPermission = courseIds.reduce((acc, curr, idx, src) => {
    if (user && hasAnyPermission(user, permission, curr)) acc.push(curr)
    return acc
  }, [])
  return courseIds_withPermission
}

const getInscriptionIds_withCourseIds = (inscriptions, courseIds) => {
  const petitionIds = inscriptions.reduce((acc, curr, idx, src) => {
    const inscription_courseId = curr.InscriptionEvent.Calendar.Call.SelectiveProcess.course_id
    if (courseIds.includes(inscription_courseId)) acc.push(curr.id)
    return acc
  }, [])
  return petitionIds
}

module.exports = {
  checkIsUserInscription,
  filter_Inscriptions_VisibleForThisUser,
  filter_Inscriptions_OwnedByPerson,
  getCourseIds_from_Inscriptions,
  filterCourseIds_withPermission,
  getInscriptionIds_withCourseIds
}
