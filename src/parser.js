const parse = (data, format) => {
  if (format === "json") {
    try {
      return JSON.parse(data)
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`)
    }
  }
  throw new Error(`Unsupported format: ${format}`)
}

export { parse }