import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { test, expect, describe } from '@jest/globals'
import compareFiles from '../index.js'
import { genDiff } from '../src/diff.js'
import { parse } from '../src/parser.js'
import format from '../src/formatters/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

// Test simple object diff functionality directly
describe('genDiff function (unit tests)', () => {
  test('compares simple objects', () => {
    const obj1 = {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    }

    const obj2 = {
      host: 'hexlet.io',
      timeout: 20,
      verbose: true,
    }

    const diff = genDiff(obj1, obj2)

    // Test for unchanged key
    const hostNode = diff.find(node => node.key === 'host')
    expect(hostNode.type).toBe('unchanged')
    expect(hostNode.value).toBe('hexlet.io')

    // Test for changed key
    const timeoutNode = diff.find(node => node.key === 'timeout')
    expect(timeoutNode.type).toBe('changed')
    expect(timeoutNode.oldValue).toBe(50)
    expect(timeoutNode.newValue).toBe(20)

    // Test for deleted keys
    const proxyNode = diff.find(node => node.key === 'proxy')
    expect(proxyNode.type).toBe('deleted')
    expect(proxyNode.value).toBe('123.234.53.22')

    const followNode = diff.find(node => node.key === 'follow')
    expect(followNode.type).toBe('deleted')
    expect(followNode.value).toBe(false)

    // Test for added keys
    const verboseNode = diff.find(node => node.key === 'verbose')
    expect(verboseNode.type).toBe('added')
    expect(verboseNode.value).toBe(true)
  })
})

// Combined tests for parsers using test.each
describe('Parser tests', () => {
  test.each([
    ['file1.json', 'json'],
    ['file1.yaml', 'yaml'],
  ])('parse %s file correctly', (filename, format) => {
    const filepath = getFixturePath(filename)
    const data = fs.readFileSync(filepath, 'utf-8')
    const obj = parse(data, format)

    // Check parsed object properties
    expect(obj).toHaveProperty('host', 'hexlet.io')
    expect(obj).toHaveProperty('timeout', 50)
    expect(obj).toHaveProperty('proxy', '123.234.53.22')
    expect(obj).toHaveProperty('follow', false)
  })
})

// Test nested structure functionality
describe('Nested structure tests', () => {
  let json1, json2, yaml1, yaml2

  beforeAll(() => {
    json1 = parse(readFile('nested1.json'), 'json')
    json2 = parse(readFile('nested2.json'), 'json')
    yaml1 = parse(readFile('nested1.yaml'), 'yaml')
    yaml2 = parse(readFile('nested2.yaml'), 'yaml')
  })

  test.each([
    ['JSON', () => genDiff(json1, json2)],
    ['YAML', () => genDiff(yaml1, yaml2)],
  ])('%s files produce correct diff structure', (_, diffFn) => {
    const result = diffFn()

    // Check nested structure handling
    const commonNode = result.find(node => node.key === 'common')
    expect(commonNode.type).toBe('nested')

    const setting6Node = commonNode.children.find(node => node.key === 'setting6')
    expect(setting6Node.type).toBe('nested')

    const dogeNode = setting6Node.children.find(node => node.key === 'doge')
    expect(dogeNode.type).toBe('nested')

    const wowNode = dogeNode.children.find(node => node.key === 'wow')
    expect(wowNode).toEqual({
      key: 'wow',
      type: 'changed',
      oldValue: '',
      newValue: 'so much',
    })

    // Verify top-level keys
    const topLevelKeys = result.map(item => item.key)
    expect(topLevelKeys).toEqual(expect.arrayContaining(['common', 'group1', 'group2', 'group3']))
  })

  test('YAML diff matches JSON diff', () => {
    const jsonDiff = genDiff(json1, json2)
    const yamlDiff = genDiff(yaml1, yaml2)
    expect(yamlDiff).toEqual(jsonDiff)
  })
})

// Combined tests for formatters using test.each
describe('Formatter tests', () => {
  // Expected outputs
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

  // Matrix of test cases
  test.each([
    // [Format name, file format, formatter, expected output]
    ['stylish', 'json', 'stylish', expectedStylish],
    ['stylish', 'yaml', 'stylish', expectedStylish],
    ['plain', 'json', 'plain', expectedPlain],
    ['plain', 'yaml', 'plain', expectedPlain],
  ])('%s formatter works with %s files', (_, fileFormat, formatter, expected) => {
    const file1 = readFile(`nested1.${fileFormat}`)
    const file2 = readFile(`nested2.${fileFormat}`)
    const obj1 = parse(file1, fileFormat)
    const obj2 = parse(file2, fileFormat)
    const diff = genDiff(obj1, obj2)

    expect(format(diff, formatter)).toEqual(expected)
  })

  test('json formatter produces valid JSON', () => {
    const file1 = readFile('nested1.json')
    const file2 = readFile('nested2.json')
    const obj1 = parse(file1, 'json')
    const obj2 = parse(file2, 'json')
    const diff = genDiff(obj1, obj2)

    const jsonOutput = format(diff, 'json')

    // Check it's valid JSON
    expect(() => JSON.parse(jsonOutput)).not.toThrow()

    // Check it correctly serializes the diff structure
    const parsedResult = JSON.parse(jsonOutput)
    expect(parsedResult).toEqual(diff)
  })
})

// Integration tests using public API
describe('Integration tests (compareFiles function)', () => {
  test.each([
    ['file1.json', 'file2.json', 'stylish'],
    ['file1.yaml', 'file2.yaml', 'stylish'],
    ['nested1.json', 'nested2.json', 'stylish'],
    ['nested1.yaml', 'nested2.yaml', 'stylish'],
    ['nested1.json', 'nested2.json', 'plain'],
    ['nested1.yaml', 'nested2.yaml', 'plain'],
  ])('compare %s with %s using %s format', (file1, file2, formatName) => {
    const path1 = getFixturePath(file1)
    const path2 = getFixturePath(file2)

    // This shouldn't throw
    expect(() => compareFiles(path1, path2, formatName)).not.toThrow()

    // Result should be a non-empty string
    const result = compareFiles(path1, path2, formatName)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
