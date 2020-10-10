/** @format */

const validateDelete = async (assignment, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Vacancy
  const vacancies = await models.Vacancy.count({ where: { assignment_id: assignment.id } })
  if (vacancies > 0) {
    errors.id = 'Este Cargo é dependência de Ofertas de Vaga ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
