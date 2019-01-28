const uuid = require('uuid/v4');
const apiRoutes = require('../../config/apiRoutes.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Step = sequelize.define('Step', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    resultDate: DataTypes.DATE,
    openAppealDate: DataTypes.DATE,
    limitAppealDate: DataTypes.DATE,
    resultAfterAppealDate: DataTypes.DATE
  }, {});
  Step.associate = function(models) {
    Step.belongsTo(models.Call, {foreignKey: 'call_id', targetKey: 'id'});
    Step.belongsTo(models.StepType, {foreignKey: 'stepType_id', targetKey: 'id'});
  };
  Step.beforeCreate((step, _ ) => {
    step.id = uuid();
    return step;
  });

  Step.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'step',
      href: apiRoutes.find(r => r.key === "stepApiRoute").value + '/' + values.id
    };

    return values;
  }

  return Step;
};