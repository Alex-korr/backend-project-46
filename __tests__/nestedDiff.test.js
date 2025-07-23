import fs from "fs"
import path from "path"
import { parse } from "../src/parser.js"
import diff from "../src/diff.js"

describe("Nested structures diff", () => {
  let json1, json2, yaml1, yaml2

  beforeAll(() => {
    // Read test files
    const readFile = (filename) => fs.readFileSync(
      path.join(process.cwd(), "__fixtures__", filename),
      "utf-8"
    )

    // Parse files with appropriate formats
    json1 = parse(readFile("nested1.json"), "json")
    json2 = parse(readFile("nested2.json"), "json")
    yaml1 = parse(readFile("nested1.yaml"), "yaml")
    yaml2 = parse(readFile("nested2.yaml"), "yaml")
  })

  describe("JSON files", () => {
    let result

    beforeEach(() => {
      result = diff(json1, json2)
    })

    test("detects nested structure changes", () => {
      const commonNode = result.find(node => node.key === "common")
      expect(commonNode.type).toBe("nested")

      const setting6Node = commonNode.children.find(node => node.key === "setting6")
      expect(setting6Node.type).toBe("nested")

      const dogeNode = setting6Node.children.find(node => node.key === "doge")
      expect(dogeNode.type).toBe("nested")

      const wowNode = dogeNode.children.find(node => node.key === "wow")
      expect(wowNode).toEqual({
        key: "wow",
        type: "changed",
        oldValue: "",
        newValue: "so much"
      })
    })

    test("correctly identifies all top-level keys", () => {
      const topLevelKeys = result.map(item => item.key)
      expect(topLevelKeys).toEqual(expect.arrayContaining(["common", "group1", "group2", "group3"]))
    })
  })

  describe("YAML files", () => {
    test("produces the same output as JSON", () => {
      const jsonDiff = diff(json1, json2)
      const yamlDiff = diff(yaml1, yaml2)
      expect(yamlDiff).toEqual(jsonDiff)
    })
  })
})