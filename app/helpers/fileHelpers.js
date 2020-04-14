/** @format */

const fs = require('fs-extra')

const createDataFolderIfNeeded = dataFolder => {
  try {
    if (!fs.existsSync(dataFolder)) {
      console.log('Diretório não existe. Vou tentar criar...')
      fs.mkdirSync(dataFolder)
    }
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

const writeJsonToFile = async (path, data) => {
  try {
    const json = JSON.stringify(data, null, 2)
    await fs.writeFile(path, json)
    console.log('Dados salvos em arquivo...')
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const readJsonFromFile = async path => {
  try {
    const json = await fs.readFile(path, 'utf8')
    const content = JSON.parse(json)
    return content
  } catch (error) {
    console.log('Erro na função: ', error)
    throw error
  }
}

const deleteFile = async path => {
  try {
    console.log('Tentando remover arquivo...')
    fs.remove(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = { createDataFolderIfNeeded, checkFile, writeJsonToFile, readJsonFromFile, deleteFile }
