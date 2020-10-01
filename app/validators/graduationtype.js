/** @format */

const validateDelete = async (graduationType, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por um Curso
  const courses = await models.Course.count({ where: { graduationType_id: graduationType.id } })
  if (courses > 0) {
    errors.id = 'Esta Tipo de Graduação é dependência de Cursos ativos.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
