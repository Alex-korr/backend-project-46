import { fileURLToPath } from "url"
import path from "path"
import { test, expect } from "@jest/globals"
import genDiff from "../src/diff.js"
import { parse } from "../src/parser.js"
import { readFileSync } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, "..", "__fixtures__", filename)

test("compare flat JSONs", () => {

  const file1 = getFixturePath("file1.json")
  const file2 = getFixturePath("file2.json")
  const data1 = readFileSync(file1, "utf-8")
  const data2 = readFileSync(file2, "utf-8")

 
  const obj1 = parse(data1, "json")
  const obj2 = parse(data2, "json")


  const diff = genDiff(obj1, obj2)


  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`

  expect(`{\n${diff}\n}`).toEqual(expected)
})