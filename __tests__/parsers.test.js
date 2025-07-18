import { fileURLToPath } from "url"
import path from "path"
import { test, expect } from "@jest/globals"
import genDiff from "../src/diff.js"
import { parse } from "../src/parser.js"
import { readFileSync } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, "..", "__fixtures__", filename)
test("compare flat YAMLs", () => {
  const file1 = getFixturePath("file1.yaml")
  const file2 = getFixturePath("file2.yaml")
  const data1 = readFileSync(file1, "utf-8")
  const data2 = readFileSync(file2, "utf-8")

  const obj1 = parse(data1, "yaml")
  const obj2 = parse(data2, "yaml")

  const diff = genDiff(obj1, obj2)

  const expected = `{
  - age: 30
  - hobbies: reading,hiking
  - isActive: true
  - name: Alice
  + user: [object Object]
}`

  expect(`{\n${diff}\n}`).toEqual(expected)
})