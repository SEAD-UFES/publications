'use strict';

const uuid = require('uuid/v4');
const models = require('../models');
const apiRoutes = require('../../config/apiRoutes.json');

module.exports = (sequelize, DataTypes) => {

  const PublicationType = sequelize.define('PublicationType', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
    }
  }, {});

  /*
  PublicationType.associate = function(models) {
    // associations can be defined here
    // PublicationTypes.belongsTo(models.Publications, {
    //  foreignKey: 'publication_id',
    //  sourceKey: 'id'
    // })
    // return PublicationType;
  };
  */

  PublicationType.beforeCreate((publicationType, _) => {
    return publicationType.id = uuid()
  });

  PublicationType.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'publicationType',
      href: apiRoutes.find(r => r.key === "publicationTypeApiRoute").value + '/' + values.id
    };

    return values;
  }

  return PublicationType;
};

