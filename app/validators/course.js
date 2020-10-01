/** @format */

const validateDelete = async (course, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por um SelectiveProcess
  const selectiveProcesses = await models.selectiveProcess.count({ where: { course_id: course.id } })
  if (selectiveProcesses > 0) {
    errors.id = 'Este Curso é dependência de Processos Seletivos ativos.'
  }

  //Não pode ser deletado se estiver sendo usado por um UserRole
  const userRoles = await models.UserRole.count({ where: { course_id: course.id } })
  if (userRoles > 0) {
    errors.id = 'Esta Curso é dependência de Atribuições de Papel ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
