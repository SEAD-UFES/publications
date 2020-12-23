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
    const process = curr.InscriptionEvent.Calendar.Call.process
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
    const processId = curr.InscriptionEvent.Calendar.Call.process.id
    if (visibleProcessIds.includes(processId)) [...acc, curr]
  }, [])

  return visibleInscriptions
}

module.exports = {
  checkIsUserInscription,
  filter_Inscriptions_VisibleForThisUser
}
