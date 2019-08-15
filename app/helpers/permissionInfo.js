const models = require('../models')

const getPermission = options => {
  if (!options.url) throw new Error('url option needed.')
  if (!options.method) throw new Error('method option needed.')

  const params = options.url.split('/')
  const model = params[2]
  const possible_id = params[3]
  const method = options.method

  permissions = {
    //selective process
    process_create: 'processo seletivo criar',
    process_read: 'processo seletivo listar',
    process_update: 'processo seletivo editar',
    process_delete: 'processo seletivo apagar',
    process_list: 'processo seletivo listar',
    //publications
    publication_create: 'publication_create',
    publication_read: 'publication_read',
    publication_update: 'publication_update',
    publication_delete: 'publication_delete',
    publication_list: '',
    //calls
    call_create: 'chamada criar',
    call_read: 'chamada acessar',
    call_update: 'chamada editar',
    call_delete: 'chamada apagar',
    call_list: '',
    //steps
    step_create: 'etapa criar',
    step_read: 'etapa acessar',
    step_update: 'etapa editar',
    step_delete: 'etapa apagar',
    step_list: '',
    //vacancies
    vacancy_create: 'vaga criar',
    vacancy_read: 'vaga acessar',
    vacancy_update: 'vaga editar',
    vacancy_delete: 'vaga apagar',
    vacancy_list: ''
  }

  switch (model) {
    case 'selectiveprocesses':
      switch (method) {
        case 'POST':
          return permissions.process_create
          break
        case 'GET':
          if (!!possible_id) {
            return permissions.process_list
          } else {
            return permissions.process_read
          }
          break
        case 'PUT':
          return permissions.process_update
          break
        case 'DELETE':
          return permissions.process_delete
          break
        default:
          throw new Error('Unable to find any method related to this route.')
      }
      break
    case 'publications':
      switch (method) {
        case 'POST':
          return permissions.publication_create
          break
        case 'GET':
          if (!!possible_id) {
            return permissions.publication_list
          } else {
            return permissions.publication_read
          }
          break
        case 'PUT':
          return permissions.publication_update
          break
        case 'DELETE':
          return permissions.publication_delete
          break
        default:
          throw new Error('Unable to find any method related to this route.')
      }
      break

    case 'calls':
      switch (method) {
        case 'POST':
          return permissions.call_create
          break
        case 'GET':
          if (!!possible_id) {
            return permissions.call_list
          } else {
            return permissions.call_read
          }
          break
        case 'PUT':
          return permissions.call_update
          break
        case 'DELETE':
          return permissions.call_delete
          break
        default:
          throw new Error('Unable to find any method related to this route.')
      }
      break

    case 'steps':
      switch (method) {
        case 'POST':
          return permissions.step_create.break
        case 'GET':
          if (!!possible_id) {
            return permissions.step_list
          } else {
            return permissions.step_read
          }
          break
        case 'PUT':
          return permissions.step_update
          break
        case 'DELETE':
          return permissions.step_delete
          break
        default:
          throw new Error('Unable to find any method related to this route.')
      }
      break

    case 'vacancies':
      switch (method) {
        case 'POST':
          return permissions.vacancy_create
          break
        case 'GET':
          if (!!possible_id) {
            return permissions.vacancy_list
          } else {
            return permissions.vacancy_read
          }
          break
        case 'PUT':
          return permissions.vacancy_update
          break
        case 'DELETE':
          return permissions.vacancy_delete
          break
        default:
          throw new Error('Unable to find any method related to this route.')
      }
      break

    default:
      throw new Error('Unable to find any model related to this route.')
  }
}

module.exports = { getPermission }
