// Combined function that handles both indent and offset
const makeSpaces = (depth, isOffset = false) => '    '.repeat(isOffset ? depth - 1 : depth)

const stringify = (value, depth) => {
  if (value === null) return 'null'
  if (typeof value !== 'object' || Array.isArray(value)) return String(value)

  // Match the exact indentation in the expected output
  const indent = makeSpaces(depth) // Using makeSpaces instead of makeIndent
  const lines = Object.entries(value).map(([key, val]) =>
    `${indent}${key}: ${stringify(val, depth + 1)}`,
  )

  return [
    '{',
    ...lines,
    `${makeSpaces(depth, true)}}`, // Using makeSpaces with isOffset=true
  ].join('\n')
}

const stylish = (diff) => {
  const iter = (nodes, depth) => {
    const indent = makeSpaces(depth, true) // Using makeSpaces with isOffset=true

    const lines = nodes.map((node) => {
      const makeString = (value, sign) =>
        `${indent}  ${sign} ${node.key}: ${stringify(value, depth + 1)}`

      const nodeTypeHandlers = {
        nested: () => `${indent}    ${node.key}: {\n${iter(node.children, depth + 1)}\n${indent}    }`,
        added: () => makeString(node.value, '+'),
        deleted: () => makeString(node.value, '-'),
        changed: () => [
          makeString(node.oldValue, '-'),
          makeString(node.newValue, '+'),
        ].join('\n'),
        unchanged: () => makeString(node.value, ' '),
      }

      const handler = nodeTypeHandlers[node.type]
      if (!handler) {
        throw new Error(`Unknown node type: ${node.type}`)
      }

      return handler()
    })

    return lines.join('\n')
  }

  return `{\n${iter(diff, 1)}\n}`
}

export default stylish
