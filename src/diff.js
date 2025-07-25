import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { parse } from './parser.js'
import format from './formatters/index.js'

const genDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2))
  const sortedKeys = _.sortBy(allKeys)

  return sortedKeys.flatMap((key) => {
    // Recursion for nested objects
    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return {
        key,
        type: 'nested',
        children: genDiff(obj1[key], obj2[key]), // 🔁
      }
    }

    // Deleted keys
    if (!_.has(obj2, key)) {
      return { key, type: 'deleted', value: obj1[key] }
    }

    // Added keys
    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: obj2[key] }
    }

    // Changed keys
    if (!_.isEqual(obj1[key], obj2[key])) {
      return {
        key,
        type: 'changed',
        oldValue: obj1[key],
        newValue: obj2[key],
      }
    }

    // Unchanged keys
    return { key, type: 'unchanged', value: obj1[key] }
  })
}

const compareFiles = (filepath1, filepath2, formatName = 'stylish') => {
  const content1 = fs.readFileSync(path.resolve(filepath1), 'utf-8')
  const content2 = fs.readFileSync(path.resolve(filepath2), 'utf-8')

  const format1 = path.extname(filepath1).slice(1)
  const format2 = path.extname(filepath2).slice(1)

  const data1 = parse(content1, format1)
  const data2 = parse(content2, format2)

  const diff = genDiff(data1, data2)
  return format(diff, formatName)
}

export { genDiff, compareFiles }
export default genDiff
