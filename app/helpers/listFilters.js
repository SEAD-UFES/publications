/*
 * @prettier
 */

'use strict'

const validator = require('validator')

const uniqueItemList = list => [...new Set(list)]

const uniqueObjectList = (list, key) => {
  const keys = new Set()
  return list.filter(el => !keys.has(el[key]) && keys.add(el[key]))
}

const unique = (list, key) => {
  if (list.length === 0) return []
  if (typeof list[0] === 'object') {
    return uniqueObjectList(list, key)
  } else {
    return uniqueItemList(list)
  }
}

const validYears = list =>
  unique(
    list
      ? list
          .split(',')
          .map(x => x.trim())
          .filter(x => Number(x) > 1990 && Number(x) < 2100)
      : []
  )

const validProcessNumbers = list =>
  unique(
    list
      ? list
          .split(',')
          .map(x => x.trim())
          .filter(x => x.length === 3 && Number(x) > 0 && Number(x) < 999)
      : []
  )

const validIds = list =>
  unique(
    list
      ? list
          .split(',')
          .map(x => x.trim())
          .filter(x => validator.isUUID(x))
      : []
  )

// remove undefined, null and [] entries from object
const removeEmpty = o => {
  for (let el of Object.keys(o)) {
    if (o[el] === undefined || o[el] === null || o[el].length === 0) delete o[el]
  }
  return o
}

const sortObjectByNameValue = (a, b) => {
  const _a = a.name.toLowerCase()
  const _b = b.name.toLowerCase()

  return _a < _b ? -1 : 1
}

module.exports = {
  unique,
  removeEmpty,
  validYears,
  validProcessNumbers,
  validIds,
  sortObjectByNameValue
}
