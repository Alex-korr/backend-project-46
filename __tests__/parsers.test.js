import { fileURLToPath } from 'url'
import path from 'path'
import { test, expect } from '@jest/globals'
import { parse } from '../src/parser.js'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)
test('parse YAML files', () => {
  // Verifying correct YAML parsing
  const file1 = getFixturePath('file1.yaml')
  const data1 = readFileSync(file1, 'utf-8')
  const obj1 = parse(data1, 'yaml')

  // Checking that YAML is parsed into the correct object
  expect(obj1).toHaveProperty('host', 'hexlet.io')
  expect(obj1).toHaveProperty('timeout', 50)
  expect(obj1).toHaveProperty('proxy', '123.234.53.22')
  expect(obj1).toHaveProperty('follow', false)
})
