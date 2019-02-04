'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
          'Roles',
          'course_id',
            {
                type:Sequelize.UUID,
                allowNull:true,
                references: {
                    model: 'RoleTypes',
                    key: 'id'
                }
            } 
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Roles','course_id');
  }
};
