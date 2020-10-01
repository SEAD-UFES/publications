/** @format */

const validateDelete = async (selectiveProcess, models) => {
  const errors = {}

  //Não pode ser deletado se estiver sendo usado por uma Call
  const calls = await models.Permission.count({ where: { selectiveProcess_id: selectiveProcess.id } })
  if (calls > 0) {
    errors.id = 'Este Processo é dependência de Chamadas ativas.'
  }

  //Não pode ser deletado se estiver sendo usado por uma Publication
  const publications = await models.Permission.count({ where: { selectiveProcess_id: selectiveProcess.id } })
  if (publications > 0) {
    errors.id = 'Este Processo é dependência de Publicações ativas.'
  }

  return !isEmpty(errors) ? errors : null
}

module.exports = { validateDelete }
