module.exports = app => {
  const api = {};
  const models = require('../models');
  const db = require('../models/index');
  const error = app.errors.me;


  api.me = (req, res) => {
    models.Person.findOne({where: {user_id: req.user.id}})
      .then(person =>{
        res.send({
          "user": req.user,
          person
        });
      });
  }

  api.update = (req, res) => {
    let User = req.body.User;
    let Person = req.body.Person;
    Person.user_id = req.user.id;
    db.sequelize.transaction().then(t => {
      return Promise.all(
        [
          models.User.findById(req.user.id, {transaction: t})
            .then(user => {
              return user.update(User, {fields: Object.keys(User), transaction: t})
            }),
          models.Person.findOne({where:{user_id:req.user.id}, transaction: t})
            .then(person => {
              if(person) return person.update(Person, {fields: Object.keys(Person), transaction: t})
              else return models.Person.create(Person, {transaction:t})
            })
        ]
      ).then(() => {
        t.commit().then(() => res.sendStatus(200));
      }).catch(err => {
        t.rollback().then(()=>{
          if(err.name === 'SequelizeValidationError') res.status(400).json(error.parse('me-01', err));
          if(err.name === 'SequelizeUniqueConstraintError') res.status(400).json(error.parse('me-02', err));
          else res.status(500).json(error.parse('me-03', err));

        });
        console.log(err);
      });
    });
  }  
  return api;
}
