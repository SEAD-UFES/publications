/** @format */

const checkIsUserInscription = async (inscription, user, db) => {
  const userPerson = await user.getPerson()
  if (!userPerson) return false

  const userPersonId = userPerson.id
  const inscriptionPersonId = inscription.person_id

  if (userPersonId === inscriptionPersonId) return true
  return false
}

const haveAccess = async (ieId, user, db) => {
  //Eu tenho permissão para baixar todas as inscrições = Tenho inscription_read no curso ao qual esse inscriptionEvent pertence.
  const courseId = await findCourseIdByInscriptionEventId(ieId)
  const havePermission = hasAnyPermission(user, 'inscription_read', courseId)
  return havePermission
}

module.exports = {
  checkIsUserInscription
}
