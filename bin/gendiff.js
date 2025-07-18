#!/usr/bin/env node
import { Command } from "commander"
import fs from "fs"
import path from "path"
import { parse } from "../src/parser.js"
import genDiff from "../src/diff.js"

const program = new Command()

// Helper function to find files in common locations
const resolveFile = (filename) => {
  const pathsToTry = [
    filename,
    path.join("__fixtures__", filename),
    path.join(process.cwd(), filename),
    path.join(process.cwd(), "__fixtures__", filename)
  ]

  for (const filepath of pathsToTry) {
    try {
      fs.accessSync(filepath, fs.constants.R_OK)
      return path.resolve(filepath)
    } catch (err) {
      continue
    }
  }
  throw new Error(`File not found: ${filename}`)
}

program
  .name("gendiff")
  .description("Compares two configuration files and shows a difference.")
  .version("1.0.0")
  .arguments("<filepath1> <filepath2>")
  .option("-f, --format <type>", "output format", "stylish")
  .action((filepath1, filepath2) => {
    try {
      const resolvedPath1 = resolveFile(filepath1)
      const resolvedPath2 = resolveFile(filepath2)

      const data1 = fs.readFileSync(resolvedPath1, "utf8").trim()
      const data2 = fs.readFileSync(resolvedPath2, "utf8").trim()

      const getFormat = (filepath) => path.extname(filepath).slice(1)
      const obj1 = parse(data1, getFormat(resolvedPath1))
      const obj2 = parse(data2, getFormat(resolvedPath2))

      const diff = genDiff(obj1, obj2)
      console.log(`{\n${diff}\n}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    }
  })
  .parse(process.argv)