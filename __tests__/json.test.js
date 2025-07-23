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

describe("gendiff json format", () => {
  test("compares nested files (json format)", () => {
    const file1 = readFile("nested1.json")
    const file2 = readFile("nested2.json")
    const obj1 = parse(file1, "json")
    const obj2 = parse(file2, "json")
    const diff = genDiff(obj1, obj2)

    // Проверяем, что результат - валидный JSON
    expect(() => JSON.parse(format(diff, "json"))).not.toThrow()

    // Проверяем структуру
    const result = JSON.parse(format(diff, "json"))
    expect(result).toEqual(diff)
  })
})
