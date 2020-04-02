module.exports = app => {
  const error404Message = req => ({
    code: 'request-404',
    userMessage: 'Página não encontrada.',
    devMessage: {
      name: 'RequestError',
      method: req.method,
      url: req.url,
      errors: {
        request: `Página não encontrada.`
      }
    }
  })

  //Depois de todas as rotas definidas. Lançar esse middleware para cuidar das rotas que não existem.
  app.route('*').all(function(req, res) {
    return res.status(404).json(error404Message(req))
  })
}
