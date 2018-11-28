'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RoleTypes', [
      { id: uuid(), name: 'Administrador',          description: 'Administrador do sistema.'},
      { id: uuid(), name: 'Secretário do Curso',    description: 'Recebe demandas dos alunos, professores e tutores.' }, 
      { id: uuid(), name: 'Professor',              description: 'Cria conteúdos das salas.' }, 
      { id: uuid(), name: 'Designer Instrucional',  description: '[Inserir descrição]' }, 
      { id: uuid(), name: 'Editor',                 description: '[Inserir descrição]' }, 
      { id: uuid(), name: 'Tutor à Distância',      description: 'Atende e avalia os alunos, fica na SEAD.' }, 
      { id: uuid(), name: 'Tutor Presencial',       description: 'Atende e avalia os alunos em cada polo.' }, 
      { id: uuid(), name: 'Coordenador de Tutoria', description: '[Inserir descrição]' }, 
      { id: uuid(), name: 'Candidato',              description: 'Inscrito em processo seletivo, interessado em ser aluno, professor ou tutor.' }, 
      { id: uuid(), name: 'Aluno',                  description: 'Estudante de Curso EAD da SEAD.' }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoleTypes', null, {});
  }
};

