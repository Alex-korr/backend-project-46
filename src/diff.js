import _ from "lodash"

const genDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2))
  const sortedKeys = _.sortBy(allKeys)

  return sortedKeys.flatMap((key) => {
    // Рекурсия для вложенных объектов
    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return {
        key,
        type: "nested",
        children: genDiff(obj1[key], obj2[key]) // 🔁
      }
    }

    // Удалённые ключи
    if (!_.has(obj2, key)) {
      return { key, type: "deleted", value: obj1[key] }
    }

    // Добавленные ключи
    if (!_.has(obj1, key)) {
      return { key, type: "added", value: obj2[key] }
    }

    // Изменённые ключи
    if (!_.isEqual(obj1[key], obj2[key])) {
      return {
        key,
        type: "changed",
        oldValue: obj1[key],
        newValue: obj2[key]
      }
    }

    // Неизменённые ключи
    return { key, type: "unchanged", value: obj1[key] }
  })
}

export default genDiff