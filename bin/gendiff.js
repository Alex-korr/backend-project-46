#!/usr/bin/env node
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { compareFiles } from '../src/diff.js'

const program = new Command()

const resolvePath = (filepath) => {
  // 1. Try to find the file relative to current directory
  let absolutePath = path.resolve(process.cwd(), filepath)

  // 2. If not found, try to find in __fixtures__ directory
  if (!fs.existsSync(absolutePath)) {
    const fixturesPath = path.resolve(process.cwd(), '__fixtures__', filepath)
    if (fs.existsSync(fixturesPath)) {
      absolutePath = fixturesPath
    }
    else {
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

      // 2. Use the compareFiles function to handle everything else
      const result = compareFiles(absolutePath1, absolutePath2, program.opts().format)

      // 3. Output the result
      console.log(result)
    }
    catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  },
  )

program.parse(process.argv)
