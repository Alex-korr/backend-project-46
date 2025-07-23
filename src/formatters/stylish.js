const INDENT_SIZE = 4
const INDENT_TYPE = " "
const MARKERS = {
  added: "+ ",
  deleted: "- ",
  unchanged: "  ",
}

/**
 * Formats a value for display, handling nested objects and special values
 * @param {any} val - The value to format
 * @param {number} depth - Current nesting depth
 * @returns {string} Formatted string representation of the value
 */
const formatValue = (val, depth) => {
  if (val === null) return "null"
  if (typeof val !== "object") return String(val)
  if (Array.isArray(val)) return JSON.stringify(val)

  const indent = INDENT_TYPE.repeat(INDENT_SIZE * depth)
  const bracketIndent = INDENT_TYPE.repeat(INDENT_SIZE * (depth - 1))
  
  // If it's an object (including parsed YAML), format it properly
  const lines = Object.entries(val).map(([key, value]) => {
    if (typeof value === "string") {
      return `${indent}${key}: ${value}`
    }
    return `${indent}${key}: ${formatValue(value, depth + 1)}`
  })

  return [
    "{",
    ...lines,
    `${bracketIndent}}`
  ].join("\n")
}

/**
 * Creates a stylish diff output format
 * @param {Array} diff - Array of diff objects
 * @param {number} depth - Current nesting depth
 * @returns {string} Formatted diff output
 */
const stylish = (diff, depth = 1) => {
  const currentIndent = INDENT_TYPE.repeat(INDENT_SIZE * depth - INDENT_SIZE)

  const lines = diff.map((node) => {
    switch (node.type) {
    case "nested":
      return `${currentIndent}  ${node.key}: {\n${stylish(node.children, depth + 1)}\n${currentIndent}  }`

    case "added":
      return `${currentIndent}${MARKERS.added}${node.key}: ${formatValue(node.value, depth)}`

    case "deleted":
      return `${currentIndent}${MARKERS.deleted}${node.key}: ${formatValue(node.value, depth)}`

    case "changed":
      return [
        `${currentIndent}${MARKERS.deleted}${node.key}: ${formatValue(node.oldValue, depth)}`,
        `${currentIndent}${MARKERS.added}${node.key}: ${formatValue(node.newValue, depth)}`
      ].join("\n")

    case "unchanged":
      return `${currentIndent}${MARKERS.unchanged}${node.key}: ${formatValue(node.value, depth)}`

    default:
      throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  return depth === 1
    ? `{\n${lines.join("\n")}\n}`
    : lines.join("\n")
}

export default stylish