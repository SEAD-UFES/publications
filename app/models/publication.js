'use strict';
const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');

module.exports = (sequelize, DataTypes) => {
  const Publication = sequelize.define('Publication', {
    selectiveProcess_id: DataTypes.UUID,
    call_id: DataTypes.UUID,
    step_id: DataTypes.UUID,
    description: DataTypes.STRING,
    file: DataTypes.STRING,
    valid: DataTypes.BOOLEAN,
    date: DataTypes.DATE
  }, {});

  Publication.associate = function(models) {
    Publication.belongsTo(models.SelectiveProcess, { foreignKey: 'selectiveProcess_id'});
    Publication.belongsTo(models.PublicationType, { foreignKey: 'publicationType_id'});
    Publication.belongsTo(models.Call, { foreignKey: 'call_id'});
    Publication.belongsTo(models.Step, { foreignKey: 'step_id'});

    return Publication;
  };

  Publication.beforeCreate((publication, _) => {
    publication.id = uuid();

    return publication;
  });

  Publication.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'publication',
      href: apiRoutes.find(r => r.key === "publicationApiRoute").value + '/' + values.id
    };

    return values;
  }

  return Publication;
};
