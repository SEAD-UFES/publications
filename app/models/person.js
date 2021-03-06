const uuid = require('uuid/v4');
'use strict';
const apiRoutes = require('../../config/apiRoutes.json');
module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: DataTypes.DATE,
    nationality: DataTypes.STRING,
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
      type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
      validate: {
        isIn: [['masculino', 'feminino', 'outro']]
      }
    }
  }, {
    paranoid:true
  });
  Person.associate = function(models) {
    Person.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  Person.beforeCreate((p, _ ) => {
    return p.id = uuid();
  });

  Person.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());

    values.link = {
      rel: 'person',
      href: apiRoutes.find(r => r.key === "personApiRoute").value + '/' + values.id
    };

    delete values.password;
    return values;
  }

  return Person;
};

