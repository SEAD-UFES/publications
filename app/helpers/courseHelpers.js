/** @format */

const findCourseIdBySelectiveProcessId = async (selectiveProcess_id, db) => {
  const process = await db.SelectiveProcess.findByPk(selectiveProcess_id)
  if (!process) return null

  return process.course_id
}

const findCourseIdByCallId = async (call_id, db) => {
  const call = await db.Call.findByPk(call_id)
  if (!call) return null

  const courseIdBySelectiveProcessId = await findCourseIdBySelectiveProcessId(call.selectiveProcess_id, db)
  return courseIdBySelectiveProcessId
}

const findCourseIdByCalendarId = async (calendar_id, db) => {
  const calendar = await db.Calendar.findByPk(calendar_id)
  if (!calendar) return null

  const courseIdByCallId = await findCourseIdByCallId(calendar.call_id, db)
  return courseIdByCallId
}

const findCourseIdByInscriptionEventId = async (inscriptionEvent_id, db) => {
  const inscriptionEvent = await db.InscriptionEvent.findByPk(inscriptionEvent_id)
  if (!inscriptionEvent) return null

  const courseIdByCalendarId = await findCourseIdByCalendarId(inscriptionEvent.calendar_id, db)
  return courseIdByCalendarId
}

const findCourseIdByInscriptionId = async (inscription_id, db) => {
  const inscription = await db.Inscription.findByPk(inscription_id)
  if (!inscription) return null

  const courseIdByInscriptionEventId = await findCourseIdByInscriptionEventId(inscription.inscriptionEvent_id, db)
  return courseIdByInscriptionEventId
}

module.exports = {
  findCourseIdBySelectiveProcessId,
  findCourseIdByCallId,
  findCourseIdByCalendarId,
  findCourseIdByInscriptionEventId,
  findCourseIdByInscriptionId
}
