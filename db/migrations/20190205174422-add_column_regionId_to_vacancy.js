'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
          'Vacancies',
          'region_id',
            {
                type:Sequelize.UUID,
                allowNull:true,
                references: {
                    model: 'Regions',
                    key: 'id'
                }
            } 
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Vacancies','region_id');
  }
};