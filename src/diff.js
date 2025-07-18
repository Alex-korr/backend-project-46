import _ from "lodash"

const formatValue = (value) => {
  if (_.isPlainObject(value)) return "[complex value]"  // Handle nested objects
  if (Array.isArray(value)) return value.join(",")     // Handle arrays
  return value
}

const genDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2))
  const sortedKeys = _.sortBy(allKeys)

  return sortedKeys.flatMap((key) => {
    if (!_.has(obj2, key)) {
      return `  - ${key}: ${formatValue(obj1[key])}`
    }
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${formatValue(obj2[key])}`
    }
    // FIXED: Type-insensitive comparison
    if (String(obj1[key]) === String(obj2[key])) {
      return `    ${key}: ${formatValue(obj1[key])}`
    }
    return [
      `  - ${key}: ${formatValue(obj1[key])}`,
      `  + ${key}: ${formatValue(obj2[key])}`
    ]
  }).join("\n")
}

export default genDiff