/** @format */

const checkIsMyPerson = async (person, user, db) => {
  const userPerson = await user.getPerson()
  if (!userPerson) return false

  const userPersonId = userPerson.id
  const personId = person.id

  if (userPersonId === personId) return true
  return false
}

module.exports = { checkIsMyPerson }
