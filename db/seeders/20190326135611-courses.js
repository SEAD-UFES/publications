"use strict";

const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Courses",
      [
        { id: uuid(), name: "Biologia - EAD", description: "Curso de licenciatura em biologia na modalidade a distância" },
        { id: uuid(), name: "Pedagogia - EAD", description: "Curso de licenciatura em pedagogia na modalidade a distância" }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Courses", null, {});
  }
};
