const formatValue = (value) => {
  if (value === null) return 'null'
  if (typeof value === 'object' && value !== null) return '[complex value]'
  if (typeof value === 'string') return `'${value}'`
  return String(value)
}

const plain = (diff, parentPath = '') => {
  const nodeTypeHandlers = {
    nested: (node, currentPath) => plain(node.children, currentPath),
    added: (node, currentPath) => `Property '${currentPath}' was added with value: ${formatValue(node.value)}`,
    deleted: (node, currentPath) => `Property '${currentPath}' was removed`,
    changed: (node, currentPath) => {
      const oldVal = formatValue(node.oldValue)
      const newVal = formatValue(node.newValue)
      return `Property '${currentPath}' was updated. From ${oldVal} to ${newVal}`
    },
    unchanged: () => null,
  }

  const lines = diff.map((node) => {
    const currentPath = parentPath ? `${parentPath}.${node.key}` : node.key
    const handler = nodeTypeHandlers[node.type]

    if (!handler) {
      throw new Error(`Unknown node type: ${node.type}`)
    }

    return handler(node, currentPath)
  })

  return lines.filter(Boolean).join('\n')
}

export default plain
