/** @format */

const checkIsUserInscription = async (inscription, user, db) => {
  const userPerson = await user.getPerson()
  if (!userPerson) return false

  const userPersonId = userPerson.id
  const inscriptionPersonId = inscription.person_id

  if (userPersonId === inscriptionPersonId) return true
  return false
}

module.exports = {
  checkIsUserInscription
}
