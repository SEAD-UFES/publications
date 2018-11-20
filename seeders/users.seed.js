const jwt = require('jsonwebtoken');
const models = require('../app/models');
const User = models.User;

const users = [
  {
    "login": "wagnerperin",
    "password": "1234",
    "userType": "ufes",
    "authorized": true
  }, {
    "login": "edo9k",
    "password": "1234",
    "userType": "sead",
    "authorized": false
  }
];


const populateUsers = done => {
  User.destroy({where: {}, force: true}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done())
}

module.exports = {users, populateUsers}
