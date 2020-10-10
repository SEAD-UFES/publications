/** @format */

const validateDelete = async (region, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Vacancy
  const vacancies = await models.Vacancy.count({ where: { region_id: region.id } })
  if (vacancies > 0) {
    errors.id = 'Esta Região é dependência de Ofertas de Vaga ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
