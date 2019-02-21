'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
          'Users',
          'deletedAt',
          {
            type:Sequelize.DATE,
            allowNull:true
          } 
      );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users','deletedAt');
  }
};

