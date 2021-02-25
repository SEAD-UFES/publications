/** @format */

'use strict'

const uuid = require('uuid/v4')
const apiRoutes = require('../../config/apiRoutes.json')
const { validateDelete } = require('../validators/people')

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    'Person',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      cpf: {
        type: DataTypes.STRING,
        validate: {
          len: [14, 14],
          isValid(strCPF) {
            strCPF = strCPF.replace(/\.|-/g, '')
            let Soma = 0
            let Resto

            if (strCPF == '00000000000') throw new Error('CPF invalid!')
            for (var i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
            Resto = (Soma * 10) % 11

            if (Resto == 10 || Resto == 11) Resto = 0
            if (Resto != parseInt(strCPF.substring(9, 10))) throw new Error('CPF invalid!')

            Soma = 0
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
            Resto = (Soma * 10) % 11

            if (Resto == 10 || Resto == 11) Resto = 0
            if (Resto != parseInt(strCPF.substring(10, 11))) throw new Error('CPF invalid!')
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
      birthdate: {
        type: DataTypes.DATE
      },
      nationality: {
        type: DataTypes.STRING
      },
      rgNumber: {
        type: DataTypes.STRING
      },
      rgDispatcher: {
        type: DataTypes.STRING
      },
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
      },
      fatherName: {
        type: DataTypes.STRING
      },
      motherName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: true, paranoid: true }
  )

  Person.associate = function (models) {
    Person.belongsTo(models.User, { foreignKey: 'user_id' })
  }

  Person.beforeCreate((person, _) => {
    return (person.id = uuid())
  })

  Person.beforeDestroy(async (person, _) => {
    //Validação de restrições em modelos relacionados. (onDelete:'RESTRICT')
    const errors = await validateDelete(person, sequelize.models)
    if (errors) {
      throw { name: 'ForbbidenDeletionError', traceback: 'Person', errors: errors }
    }

    //Operações em modelos relacionados (onDelete:'CASCADE' ou 'SET NULL')
    //sem modelos associados para deletar.
  })

  Person.prototype.toJSON = function () {
    let values = Object.assign({}, this.get())

    //remove fields
    delete values.password
    delete values.deletedAt

    //"follow your nose..."
    values.link = {
      rel: 'person',
      href: apiRoutes.find(r => r.key === 'personApiRoute').value + '/' + values.id
    }

    return values
  }

  return Person
}
