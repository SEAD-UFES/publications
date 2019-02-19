const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.STRING
  }, {});
  Course.associate = function(models) {
    // associations can be defined here
  };
  Course.beforeCreate((course, _) => {
    course.id = uuid();
    return course;
  });

  Course.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'course',
      href: apiRoutes.find(r => r.key === "courseApiRoute").value + '/' + values.id
    };

    return values;
  }
  return Course;
};