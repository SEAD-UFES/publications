/** @format */

const { hasAnyPermission } = require('./permissionCheck')

const filter_PetitionReply_VisibleForThisUser = (petitionReplies, user) => {
  const visiblePetitionReplies = petitionReplies.reduce((acc, curr) => {
    const haveListPermition = user ? hasAnyPermission(user, 'petitionreply_list', curr.course_id) : false
    const pr_personId = curr.Petition.Inscription.person_id
    const us_personId = user.Person ? user.Person.id : null

    //if I have permittion
    if (haveListPermition) {
      acc = [...acc, curr]
      return acc
    }

    //if I am the owner
    if (pr_personId === us_personId) {
      acc = [...acc, curr]
      return acc
    }

    return acc
  }, [])

  return visiblePetitionReplies
}

module.exports = {
  filter_PetitionReply_VisibleForThisUser
}
