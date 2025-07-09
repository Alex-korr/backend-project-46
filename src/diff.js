import _ from "lodash"

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const allKeys = _.union(keys1, keys2)
  const sortedKeys = _.sortBy(allKeys)

  const diffLines = sortedKeys.map((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (!_.has(obj2, key)) {
      return `  - ${key}: ${value1}`
    }

    if (!_.has(obj1, key)) {
      return `  + ${key}: ${value2}`
    }

    if (_.isEqual(value1, value2)) {
      return `    ${key}: ${value1}`
    }

    return `  - ${key}: ${value1}\n  + ${key}: ${value2}`
  })

  return diffLines.join("\n")

}

export default genDiff