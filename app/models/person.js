const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  },{
    paranoid:true
  });
  Person.associate = function(models) {
    Person.hasOne(models.physicalPerson, { foreignKey: 'person_id' })
  };

  Person.beforeCreate((person, _ ) => {
    return person.id = uuid();
  });
  return Person;
};