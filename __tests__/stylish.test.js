import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'
import genDiff from '../src/diff.js'
import { parse } from '../src/parser.js'
import format from '../src/formatters/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

describe('gendiff stylish format', () => {
  // This is the exact output that our formatter produces, matching Hexlet's expected format
  const expectedStylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`

  test('compares nested JSON files (stylish format)', () => {
    const file1 = readFile('nested1.json')
    const file2 = readFile('nested2.json')
    const obj1 = parse(file1, 'json')
    const obj2 = parse(file2, 'json')
    const diff = genDiff(obj1, obj2)
    expect(format(diff, 'stylish')).toEqual(expectedStylish)
  })

  test('compares nested YAML files (stylish format)', () => {
    const file1 = readFile('nested1.yaml')
    const file2 = readFile('nested2.yaml')
    const obj1 = parse(file1, 'yaml')
    const obj2 = parse(file2, 'yaml')
    const diff = genDiff(obj1, obj2)
    expect(format(diff, 'stylish')).toEqual(expectedStylish)
  })
})
