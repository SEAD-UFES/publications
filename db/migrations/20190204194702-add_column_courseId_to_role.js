'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .addColumn(
          'UserRoles',
          'course_id',
            {
                type:Sequelize.UUID,
                allowNull:true,
                references: {
                    model: 'Courses',
                    key: 'id'
                }
            } 
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('UserRoles','course_id');
  }
};
