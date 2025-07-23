#!/usr/bin/env node
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { parse } from '../src/parser.js'
import genDiff from '../src/diff.js'
import format from '../src/formatters/index.js'

const program = new Command()

const resolvePath = filepath => {
  // 1. Try to find the file relative to current directory
  let absolutePath = path.resolve(process.cwd(), filepath)

  // 2. If not found, try to find in __fixtures__ directory
  if (!fs.existsSync(absolutePath)) {
    const fixturesPath = path.resolve(process.cwd(), '__fixtures__', filepath)
    if (fs.existsSync(fixturesPath)) {
      absolutePath = fixturesPath
    } else {
      throw new Error(`File not found: ${filepath}`)
    }
  }

  return absolutePath
}

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    try {
      // 1. Get absolute paths
      const absolutePath1 = resolvePath(filepath1)
      const absolutePath2 = resolvePath(filepath2)

      // 2. Read files
      const content1 = fs.readFileSync(absolutePath1, 'utf-8')
      const content2 = fs.readFileSync(absolutePath2, 'utf-8')

      // 3. Determine format (json/yml/yaml)
      const getFormat = filepath => {
        const ext = path.extname(filepath).slice(1)
        return ext === 'yml' ? 'yaml' : ext
      }

      // 4. Parse and compare
      const obj1 = parse(content1, getFormat(absolutePath1))
      const obj2 = parse(content2, getFormat(absolutePath2))
      const diff = genDiff(obj1, obj2)

      // 5. Output the result
      console.log(format(diff, program.opts().format))
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  })

program.parse(process.argv)
