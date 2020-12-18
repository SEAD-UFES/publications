/** @format */

'use strict'

const { hasAnyPermission } = require('./permissionCheck')

const filterVisibleByProcessId = async (processId, user, db) => {
  const process = await db.SelectiveProcess.findByPk(processId)
  if (!process) return null

  const haveProcessPermission = user ? hasAnyPermission(user, 'selectiveprocess_read', process.course_id) : false
  if (!process.visible && !haveProcessPermission) return null

  return processId
}

const filterVisibleByProcessIds = async (selectiveProcessIds, user, db) => {
  return Promise.all(selectiveProcessIds.map(id => filterVisibleByProcessId(id, user, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}

const filterVisibleByCallId = async (callId, user, db) => {
  const call = await db.Call.findByPk(callId)
  if (!call) return null

  const process = await call.getSelectiveProcess()
  if (!process) return null

  const haveProcessPermission = user ? hasAnyPermission(user, 'selectiveprocess_read', process.course_id) : false
  if (!process.visible && !haveProcessPermission) return null

  return callId
}

const filterVisibleByCallIds = async (callIds, user, db) => {
  return Promise.all(callIds.map(id => filterVisibleByCallId(id, user, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}

const filterVisibleByCalendarId = async (calendarId, user, db) => {
  const calendar = await db.Calendar.findByPk(calendarId)
  if (!calendar) return null

  const callId = await filterVisibleByCallId(calendar.call_id, user, db)
  if (!callId) return null

  return calendarId
}

const filterVisibleByCalendarIds = async (calendarIds, user, db) => {
  return Promise.all(calendarIds.map(id => filterVisibleByCalendarId(id, user, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}

const filterVisibleByInscriptionEventId = async (inscriptionEventId, user, db) => {
  const inscriptionEvent = await db.InscriptionEvent.findByPk(inscriptionEventId)
  if (!inscriptionEvent) return null

  const calendarId = await filterVisibleByCalendarId(inscriptionEvent.calendar_id, user, db)
  if (!calendarId) return null

  return inscriptionEventId
}

const filterVisibleByInscriptionEventIds = async (inscriptionEventIds, user, db) => {
  return Promise.all(inscriptionEventIds.map(id => filterVisibleByInscriptionEventId(id, user, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}

const filterVisibleByPetitionEventId = async (petitionEventId, user, db) => {
  const petitionEvent = await db.PetitionEvent.findByPk(petitionEventId)
  if (!petitionEvent) return null

  const calendarId = await filterVisibleByCalendarId(petitionEventId.calendar_id, user, db)
  if (!calendarId) return null

  return petitionEventId
}

const filterVisibleByPetitionEventIds = async (petitionEventIds, user, db) => {
  return Promise.all(petitionEventIds.map(id => filterVisibleByPetitionEventId(id, user, db))).then(new_list =>
    new_list.filter(item => item !== null)
  )
}

module.exports = {
  filterVisibleByProcessId,
  filterVisibleByProcessIds,
  filterVisibleByCallId,
  filterVisibleByCallIds,
  filterVisibleByCalendarId,
  filterVisibleByCalendarIds,
  filterVisibleByInscriptionEventId,
  filterVisibleByInscriptionEventIds,
  filterVisibleByPetitionEventId,
  filterVisibleByPetitionEventIds
}
