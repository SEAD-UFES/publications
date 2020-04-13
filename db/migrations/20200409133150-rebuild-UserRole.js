/** @format */

'use strict'

const fs = require('fs-extra')

const getDeletedLines = async queryInterface => {
  try {
    return await queryInterface.sequelize.query('SELECT * from userroles WHERE isActive IS NULL', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const truncateDeletedLines = async queryInterface => {
  try {
    return await queryInterface.sequelize.query('DELETE FROM userroles WHERE isActive IS NULL;', {
      type: queryInterface.sequelize.QueryTypes.DELETE
    })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const insertDeletedLines = async (queryInterface, lines) => {
  try {
    const dataHeaders = '(`id`, `roleType_id`, `user_id`, `createdAt`, `updatedAt`, `course_id`, `deletedAt`)'

    const dataLines = lines
      .map(ln => {
        const course_id = ln.course_id ? `\'${ln.course_id}\'` : null
        const deletedAt = ln.deletedAt ? `\'${ln.deletedAt}\'` : null
        return `(\'${ln.id}\', \'${ln.roleType_id}\', \'${ln.user_id}\', \'${ln.createdAt}\', \'${ln.updatedAt}\', ${course_id}, ${deletedAt}),`
      })
      .reduce((acc, item) => acc + item, '')
      .slice(0, -1)

    const insertQuery = `INSERT INTO userroles ${dataHeaders} VALUES ${dataLines}`

    return await queryInterface.sequelize.query(insertQuery, { type: queryInterface.sequelize.QueryTypes.INSERT })
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const createDataFolderIfNeeded = () => {
  const dataFolder = `${__dirname}/data`
  if (!fs.existsSync(dataFolder)) {
    console.log('Diretório base não existe. Vou tentar criar...')
    fs.mkdirSync(dataFolder)
  }
}

const writeJsonToFile = async (path, data) => {
  const json = JSON.stringify(data, null, 2)

  try {
    await fs.writeFile(path, json)
    console.log('Dados salvos em arquivo...')
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const checkFile = path => {
  try {
    return fs.existsSync(path)
  } catch (err) {
    console.error(err)
    throw error
  }
}

const readJsonFromFile = async path => {
  try {
    const json = await fs.readFile(path, 'utf8')
    const content = JSON.parse(json)
    return content
  } catch (error) {
    console.log(error)
    throw error
  }
}

const removeUserIdFK = 'ALTER TABLE `database_development`.`userroles` DROP FOREIGN KEY `userroles_ibfk_2`'
const restoreUserIdFK =
  'ALTER TABLE `database_development`.`userroles` ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `database_development`.`users` (`id`)  ON DELETE RESTRICT ON UPDATE RESTRICT'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        //id ok
        //roleType_id ok
        //user_id ok
        //createdAt ok
        //updatedAt ok
        //deletedAt
        queryInterface
          .addColumn(
            'UserRoles',
            'deletedAt',
            {
              type: Sequelize.DATE,
              allowNull: true
            },
            { transaction: t }
          )
          .then(() => {
            //isActive
            return queryInterface.addColumn(
              'UserRoles',
              'isActive',
              { type: 'INT(1) GENERATED ALWAYS AS (IF(deletedAt IS NULL,  1, NULL)) VIRTUAL' },
              { transaction: t }
            )
          })
          //remove FK
          .then(() => {
            queryInterface.sequelize.query(removeUserIdFK, { transaction: t })
          })
          //remove index
          .then(() => {
            return queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })
          })
          //add index paranoid
          .then(() => {
            return Promise.all([
              queryInterface.addIndex(
                'UserRoles',
                ['user_id', 'roleType_id', 'isActive'],
                {
                  type: 'unique',
                  name: 'unique_user_role_isActive'
                },
                { transaction: t }
              ),
              queryInterface.addIndex(
                'UserRoles',
                ['user_id'],
                {
                  name: 'user_id'
                },
                { transaction: t }
              )
            ])
          })
          //restore FK
          .then(() => {
            return queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })
          })
          .then(async () => {
            try {
              const dataPath = `${__dirname}/data/UserRole-deletedLines.json`
              if (checkFile(dataPath)) {
                console.log('Arquivo de dados existe...')
                const linesToInsert = await readJsonFromFile(dataPath)
                await insertDeletedLines(queryInterface, linesToInsert)
              }
            } catch (error) {
              console.log('Erro em up: ', error)
              throw error
            }
          })
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    //salvar dados da migration em arquivo.
    try {
      const linesToSave = await getDeletedLines(queryInterface)
      if (linesToSave.length > 0) {
        console.log('Tenho dados para salvar...')
        createDataFolderIfNeeded()
        const dataPath = `${__dirname}/data/UserRole-deletedLines.json`
        await writeJsonToFile(dataPath, linesToSave)
        await truncateDeletedLines(queryInterface)
      }
    } catch (error) {
      console.log('Erro em down: ', error)
      throw error
    }

    return queryInterface.sequelize.transaction(t => {
      //verificar se tem dados para guardar

      return Promise.all([
        //id ok
        //roleType_id ok
        //user_id ok
        //createdAt ok
        //updatedAt ok

        //remover FK
        queryInterface.sequelize
          .query(removeUserIdFK, { transaction: t })
          .then(() => {
            //remover uniqueKeys
            return Promise.all([
              queryInterface.removeIndex('UserRoles', 'unique_user_role_isActive', { transaction: t }),
              queryInterface.removeIndex('UserRoles', 'user_id', { transaction: t })
            ])
          })
          .then(() => {
            //restaurar uniqueKey
            return queryInterface.addIndex('UserRoles', ['user_id'], { name: 'user_id' }, { transaction: t })
          })
          .then(() => {
            //restaurar FK
            return queryInterface.sequelize.query(restoreUserIdFK, { transaction: t })
          })
          .then(() => {
            //isActive
            return queryInterface.removeColumn('UserRoles', 'isActive', { transaction: t })
          })
          .then(() => {
            //deletedAt
            return queryInterface.removeColumn('UserRoles', 'deletedAt', { transaction: t })
          })
      ])
    })
  }
}
