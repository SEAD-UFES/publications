'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
        'Courses',
        'graduationType_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'GraduationTypes',
            key: 'id'
          }
        }
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Courses', 'graduationType_id');
  }
};
