import { load } from "js-yaml"

export const parse = (data) => {
  // Try YAML first (handles JSON too)
  try {
    return load(data)
  } catch {
    // Fallback to JSON
    try {
      return JSON.parse(data)
    } catch {
      throw new Error("Invalid YAML or JSON")
    }
  }
}
