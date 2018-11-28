'use strict';

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');


let passwordHash = bcrypt.hashSync("senhausuarioteste2018", 10);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { id: uuid(), login: "admin@mail.com", password: passwordHash, userType: 'ufes', authorized: true },  
      { id: uuid(), login: "usuario.sead.nao.autorizado@mail.com", password: passwordHash, userType: 'sead', authorized: false },   
      { id: uuid(), login: "usuario.ufes.nao.autorizado@mail.com", password: passwordHash, userType: 'ufes', authorized: false },  
      { id: uuid(), login: "usuario.sead.autorizado@mail.com", password: passwordHash, userType: 'sead', authorized: true },  
      { id: uuid(), login: "usuario.ufes.autorizado@mail.com", password: passwordHash, userType: 'ufes', authorized: true },  
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});    
  }
};
