import yaml from 'js-yaml'

export const parse = (data, format) => {
  try {
    // Parse based on the format
    if (format === 'json') {
      return JSON.parse(data)
    }
    if (format === 'yaml' || format === 'yml') {
      return yaml.load(data)
    }
    throw new Error(`Unsupported format: ${format}`)
  }
  catch (e) {
    throw new Error(`Parsing error: ${e.message}`)
  }
}
