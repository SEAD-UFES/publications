/** @format */

const validateDelete = async (publicationType, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Publication
  const publications = await models.Publication.count({ where: { publicationType_id: publicationType.id } })
  if (publications > 0) {
    errors.id = 'Este Tipo de Publicação é dependência de Publicações ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
