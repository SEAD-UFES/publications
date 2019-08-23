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
        read: 'usuário acessar',
        list: 'usuários listar'
      },
      POST: {
        create: 'usuário criar'
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
        read: 'processo seletivo listar',
        list: 'processo seletivo listar'
      },
      POST: {
        create: 'processo seletivo criar'
      },
      PUT: {
        update: 'processo seletivo editar'
      },
      DELETE: {
        delete: 'processo seletivo apagar'
      }
    },
    publications: {
      GET: {
        read: 'publication_read',
        list: 'publication_read'
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
        read: 'chamada acessar',
        list: 'chamada acessar'
      },
      POST: {
        create: 'chamada criar'
      },
      PUT: {
        update: 'chamada editar'
      },
      DELETE: {
        delete: 'chamada apagar'
      }
    },
    steps: {
      GET: {
        read: 'etapa acessar',
        list: 'etapa acessar'
      },
      POST: {
        create: 'etapa criar'
      },
      PUT: {
        update: 'etapa editar'
      },
      DELETE: {
        delete: 'etapa apagar'
      }
    },
    vacancies: {
      GET: {
        read: 'vaga acessar',
        list: 'vaga acessar'
      },
      POST: {
        create: 'vaga criar'
      },
      PUT: {
        update: 'vaga editar'
      },
      DELETE: {
        delete: 'vaga apagar'
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
