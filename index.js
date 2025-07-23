import fs from 'fs'
import path from 'path'
import { parse } from './src/parser.js'
import genDiff from './src/diff.js'
import format from './src/formatters/index.js'

const compareFiles = (filepath1, filepath2, formatName = 'stylish') => {
  const content1 = fs.readFileSync(path.resolve(filepath1), 'utf-8')
  const content2 = fs.readFileSync(path.resolve(filepath2), 'utf-8')

  const format1 = path.extname(filepath1).slice(1)
  const format2 = path.extname(filepath2).slice(1)

  const data1 = parse(content1, format1)
  const data2 = parse(content2, format2)

  const diff = genDiff(data1, data2)
  return format(diff, formatName)
}

export default compareFiles
