const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define('Vacancy', {
    qtd: DataTypes.INTEGER,
    reserve: DataTypes.BOOLEAN
  });
  Vacancy.associate = function(models) {
    Vacancy.belongsTo(models.Assignment,  {
      sourceKey: 'id',
      foreignKey: 'assignment_id'
    });
    Vacancy.belongsTo(models.Restriction, {
      sourceKey: 'id',
      foreignKey: 'restriction_id'
    });
    Vacancy.belongsTo(models.Call, {foreignKey: 'call_id', targetKey: 'id'});
    Vacancy.belongsTo(models.Region, {foreignKey: 'region_id', targetKey: 'id'});
  };

  Vacancy.beforeCreate((vacancy, _ ) => {
    vacancy.id = uuid();
    return vacancy;
  });

  Vacancy.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'vacancy',
      href: apiRoutes.find(r => r.key === "vacancyApiRoute").value + '/' + values.id
    };

    return values;
  }
  return Vacancy;
};
