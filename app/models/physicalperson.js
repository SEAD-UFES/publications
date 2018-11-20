const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const physicalPerson = sequelize.define('physicalPerson', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
        len: [14,14],
        isValid(strCPF) {
          strCPF = strCPF.replace(/\.|-/g, '');
          let Soma = 0, Resto;
          if (strCPF == "00000000000") throw new Error('CPF invalid!');
            
          for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
          Resto = (Soma * 10) % 11;
          
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(9, 10)) ) throw new Error('CPF invalid!');
          
          Soma = 0;
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;
          
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(10, 11) ) ) throw new Error('CPF invalid!');
        }
      },
      allowNull: false,
      unique: true
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: DataTypes.DATE,
    nacionality: DataTypes.STRING,
    rgNumber: DataTypes.STRING,
    rgDispatcher: DataTypes.STRING,
    ethnicity: {
      type: DataTypes.ENUM('branco', 'pardo', 'preto', 'indígena', 'amarelo'),
      validate: {
        isIn: [['branco', 'pardo', 'preto', 'indígena', 'amarelo']]
      }
    },
    civilStatus: {
      type: DataTypes.ENUM('solteiro', 'casado', 'divorciado', 'viúvo', 'separado'),
      validate: {
        isIn: [['solteiro', 'casado', 'divorciado', 'viúvo', 'separado']]
      }
    },
    gender: {
      type: DataTypes.ENUM('masculino', 'feminino'),
      validate: {
        isIn: [['masculino', 'feminino']]
      }
    }
  }, {
    paranoid:true
  });
  physicalPerson.associate = function(models) {
    physicalPerson.belongsTo(models.User, { foreignKey: 'user_id' });
    physicalPerson.belongsTo(models.Person, { foreignKey: 'person_id' });
  };
  physicalPerson.beforeCreate((p, _ ) => {
    return p.id = uuid();
  });

  return physicalPerson;
};