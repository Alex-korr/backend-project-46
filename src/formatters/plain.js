const formatValue = (value) => {
  if (value === null) return 'null'
  if (typeof value === 'object' && value !== null) return '[complex value]'
  if (typeof value === 'string') return `'${value}'`
  return String(value)
}

const plain = (diff, parentPath = '') => {
  const lines = diff.map((node) => {
    const currentPath = parentPath ? `${parentPath}.${node.key}` : node.key

    switch (node.type) {
      case 'nested':
        return plain(node.children, currentPath)
      case 'added':
        return `Property '${currentPath}' was added with value: ${formatValue(node.value)}`
      case 'deleted':
        return `Property '${currentPath}' was removed`
      case 'changed': {
        const oldVal = formatValue(node.oldValue)
        const newVal = formatValue(node.newValue)
        return `Property '${currentPath}' was updated. From ${oldVal} to ${newVal}`
      }
      case 'unchanged':
        return null
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  return lines.filter(Boolean).join('\n')
}

export default plain
