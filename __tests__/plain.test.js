import { fileURLToPath } from "url"
import path, { dirname } from "path"
import fs from "fs"
import genDiff from "../src/diff.js"
import { parse } from "../src/parser.js"
import format from "../src/formatters/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, "..", "__fixtures__", filename)
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), "utf-8")

describe("gendiff plain format", () => {
  const expectedPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`

  test("compares nested JSON files (plain format)", () => {
    const file1 = readFile("nested1.json")
    const file2 = readFile("nested2.json")
    const obj1 = parse(file1, "json")
    const obj2 = parse(file2, "json")
    const diff = genDiff(obj1, obj2)
    expect(format(diff, "plain")).toEqual(expectedPlain)
  })

  test("compares nested YAML files (plain format)", () => {
    const file1 = readFile("nested1.yaml")
    const file2 = readFile("nested2.yaml")
    const obj1 = parse(file1, "yaml")
    const obj2 = parse(file2, "yaml")
    const diff = genDiff(obj1, obj2)
    expect(format(diff, "plain")).toEqual(expectedPlain)
  })
})
