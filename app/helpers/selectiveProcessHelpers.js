/** @format */

'use strict'

const { hasAnyPermission } = require('./permissionCheck')

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

module.exports = {
  filterVisibleByCallId,
  filterVisibleByCallIds,
  filterVisibleByCalendarId,
  filterVisibleByCalendarIds
}
