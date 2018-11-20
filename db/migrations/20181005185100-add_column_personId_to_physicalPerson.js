'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
          'PhysicalPeople',
          'person_id',
          {
            type: Sequelize.UUID,
            references: {
              model: "People",
              key: 'id'
            }
        }
      );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('PhysicalPeople','person_id');
  }
};