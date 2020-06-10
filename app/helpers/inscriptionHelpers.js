/** @format */

const checkIsUserInscription = async (inscription, user, db) => {
  const UserPerson = await user.getPerson()
  const userPersonId = UserPerson.id
  const inscriptionPersonId = inscription.person_id

  if (userPersonId === inscriptionPersonId) return true
  return false
}

module.exports = {
  checkIsUserInscription
}
