import fs from "fs"
import path from "path"
import { parse } from "./src/parser.js"

const genDiff = (filepath1, filepath2) => {
  const content1 = fs.readFileSync(path.resolve(filepath1), "utf-8")
  const content2 = fs.readFileSync(path.resolve(filepath2), "utf-8")
  
  const format1 = path.extname(filepath1).slice(1)
  const format2 = path.extname(filepath2).slice(1)

  const data1 = parse(content1, format1)
  const data2 = parse(content2, format2)

  // TODO: Implement diff generation and formatting
  return JSON.stringify({ data1, data2 }, null, 2)
}

export default genDiff
