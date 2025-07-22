
import * as jsYaml from "js-yaml"

export const parse = (content, format) => {
  try {
    // Parse based on the format
    if (format === "json") {
      return JSON.parse(content)
    }
    if (format === "yaml" || format === "yml") {
      return jsYaml.load(content)
    }
    throw new Error(`Unsupported format: ${format}`)
  } catch (e) {
    throw new Error(`Parsing error: ${e.message}`)
  }
}