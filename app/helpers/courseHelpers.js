/** @format */

const findCourseIdBySelectiveProcessId = async (selectiveProcess_id, db) => {
  const process = await db.SelectiveProcess.findByPk(selectiveProcess_id)
  if (!process) return null

  return process.course_id
}

const findCourseIdByCallId = async (call_id, db) => {
  const call = await db.Call.findByPk(call_id)
  if (!call) return null

  return await findCourseIdBySelectiveProcessId(call.process_id, db)
}

const findCourseIdByCalendarId = async (calendar_id, db) => {
  const calendar = await db.Calendar.findByPk(calendar_id)
  if (!calendar) return null

  return await findCourseIdByCallId(calendar.call_id, db)
}

const findCourseIdByInscriptionEventId = async (inscriptionEvent_id, db) => {
  const inscriptionEvent = await db.InscriptionEvent.findByPk(inscriptionEvent_id)
  if (!inscriptionEvent) return null

  return findCourseIdByCalendarId(inscriptionEvent.calendar_id, db)
}

module.exports = {
  findCourseIdBySelectiveProcessId,
  findCourseIdByCallId,
  findCourseIdByCalendarId,
  findCourseIdByInscriptionEventId
}
