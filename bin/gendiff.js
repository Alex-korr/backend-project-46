#!/usr/bin/env node
import { Command } from "commander"
import fs from "fs"
import path from "path"
import { parse } from "../src/parser.js"
import genDiff from "../src/diff.js"

const program = new Command()

program
  .name("gendiff")
  .description("Compares two configuration files and shows a difference.")
  .version("1.0.0")
  .arguments("<filepath1> <filepath2>")
  .option("-f, --format <type>", "output format", "stylish")
  .action((filepath1, filepath2) => {
  
    const data1 = fs.readFileSync(path.resolve(filepath1), "utf8")
    const data2 = fs.readFileSync(path.resolve(filepath2), "utf8")

    const getFormat = (filepath) => path.extname(filepath).slice(1)
    const format1 = getFormat(filepath1)
    const format2 = getFormat(filepath2)

  
    const obj1 = parse(data1, format1)
    const obj2 = parse(data2, format2)

    const diff = genDiff(obj1, obj2)
    console.log(`{\n${diff}\n}`)
  })
  .parse(process.argv)