module.exports = app => {
  const api = {};

  api.me = (req, res) => {
    res.send({
      "user": {
        "id": req.user.id, 
        "login": req.user.login
      } 
    })
  }

  return api;
}
