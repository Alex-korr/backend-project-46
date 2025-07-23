// This is a completely rewritten version to exactly match Hexlet's output format
const makeIndent = (depth) => '    '.repeat(depth)
const makeOffset = (depth) => '    '.repeat(depth - 1)

const stringify = (value, depth) => {
  if (value === null) return 'null'
  if (typeof value !== 'object' || Array.isArray(value)) return String(value)

  // Match the exact indentation in the expected output
  const indent = makeIndent(depth)
  const lines = Object.entries(value).map(([key, val]) =>
    `${indent}${key}: ${stringify(val, depth + 1)}`,
  )

  return [
    '{',
    ...lines,
    `${makeOffset(depth)}}`,
  ].join('\n')
}

const stylish = (diff) => {
  const iter = (nodes, depth) => {
    const indent = makeOffset(depth)

    const lines = nodes.map((node) => {
      const makeString = (value, sign) =>
        `${indent}  ${sign} ${node.key}: ${stringify(value, depth + 1)}`

      switch (node.type) {
        case 'nested':
          return `${indent}    ${node.key}: {\n${iter(node.children, depth + 1)}\n${indent}    }`

        case 'added':
          return makeString(node.value, '+')

        case 'deleted':
          return makeString(node.value, '-')

        case 'changed':
          return [
            makeString(node.oldValue, '-'),
            makeString(node.newValue, '+'),
          ].join('\n')

        case 'unchanged':
          return makeString(node.value, ' ')

        default:
          throw new Error(`Unknown node type: ${node.type}`)
      }
    })

    return lines.join('\n')
  }

  return `{\n${iter(diff, 1)}\n}`
}

export default stylish
