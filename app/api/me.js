module.exports = app => {
  const api = {};
  const models = require('../models');

  api.me = (req, res) => {
    models.Person.findOne(
      {
        where: {user_id: req.user.id}
      }
    ).then(person =>{
      res.send({
        "user": req.user,
        person
      });
    });
  }

  return api;
}
