'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('People', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      }, 
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthdate: {
        type: Sequelize.DATE
      },
      nationality: {
        type: Sequelize.STRING
      },
      rgNumber: {
        type: Sequelize.STRING
      },
      rgDispatcher: {
        type: Sequelize.STRING
      },
      ethnicity: {
        type: Sequelize.ENUM('branco', 'pardo', 'preto', 'indígena', 'amarelo'),
        validate: {
          isIn: [['branco', 'pardo', 'preto', 'indígena', 'amarelo']]
        }
      },
      civilStatus: {
        type: Sequelize.ENUM('solteiro', 'casado', 'divorciado', 'viúvo', 'separado'),
        validate: {
          isIn: [['solteiro', 'casado', 'divorciado', 'viúvo', 'separado']]
        }
      },
      gender: {
        type: Sequelize.ENUM('masculino', 'feminino', 'outro'),
        validate: {
          isIn: [['masculino', 'feminino', 'outro']]
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      deletedAt:{
        type:Sequelize.DATE,
        allowNull: true
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('People');
  }
};

