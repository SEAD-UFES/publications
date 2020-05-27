/** @format */

const models = require('../models')

const getPermission = options => {
  if (!options.url) throw new Error('url option needed.')
  if (!options.method) throw new Error('method option needed.')

  const params = options.url.split('/')
  let model_name = params[2]
  if (model_name.includes('?')) {
    model_name = model_name.split('?')[0]
  }
  const option1 = params[3]
  const method_name = options.method

  permissions = {
    users: {
      GET: {
        read: 'user_read',
        list: 'user_list'
      },
      POST: {
        create: 'user_create'
      },
      PUT: {
        update: 'usuários editar'
      },
      DELETE: {
        delete: 'usuário apagar'
      }
    },
    selectiveprocesses: {
      GET: {
        read: 'selectiveprocess_read',
        list: 'selectiveprocess_list'
      },
      POST: {
        create: 'selectiveprocess_create'
      },
      PUT: {
        update: 'selectiveprocess_create'
      },
      DELETE: {
        delete: 'processo seletivo apagar'
      }
    },
    publications: {
      GET: {
        read: 'publication_read',
        list: 'publication_list'
      },
      POST: {
        create: 'publication_create'
      },
      PUT: {
        update: 'publication_update'
      },
      DELETE: {
        delete: 'publication_delete'
      }
    },
    calls: {
      GET: {
        read: 'call_read',
        list: 'call_list'
      },
      POST: {
        create: 'call_create'
      },
      PUT: {
        update: 'call_update'
      },
      DELETE: {
        delete: 'call_delete'
      }
    },
    steps: {
      GET: {
        read: 'step_read',
        list: 'step_list'
      },
      POST: {
        create: 'step_create'
      },
      PUT: {
        update: 'step_update'
      },
      DELETE: {
        delete: 'step_delete'
      }
    },
    vacancies: {
      GET: {
        read: 'vacancy_read',
        list: 'vacancy_read'
      },
      POST: {
        create: 'vacancy_create'
      },
      PUT: {
        update: 'vacancy_update'
      },
      DELETE: {
        delete: 'vacancy_delete'
      }
    },
    calendars: {
      GET: {
        read: 'calendar_read',
        list: 'calendar_read'
      },
      POST: {
        create: 'calendar_create'
      },
      PUT: {
        update: 'calendar_update'
      },
      DELETE: {
        delete: 'calendar_delete'
      }
    }
  }

  if (!permissions[model_name]) {
    throw new Error('Unable to find any model related to this route.')
  }

  if (!permissions[model_name][method_name]) {
    throw new Error('Unable to find any method related to this route.')
  }

  let permission = undefined
  switch (method_name) {
    case 'POST':
      permission = permissions[model_name][method_name].create
      break
    case 'GET':
      if (!option1) {
        permission = permissions[model_name][method_name].list
        break
      }
      if (option1 === 'minimal') {
        permission = permissions[model_name][method_name].minimal
      } else if (option1 === 'find') {
        permission = permissions[model_name][method_name].find
      } else {
        permission = permissions[model_name][method_name].read
      }
      break
    case 'PUT':
      permission = permissions[model_name][method_name].update
      break
    case 'DELETE':
      permission = permissions[model_name][method_name].delete
      break
    default:
      break
  }

  if (typeof permission === 'undefined') {
    throw new Error('Unable to find any permission related to this route.')
  }

  return permission
}
module.exports = { getPermission }
