import { nanoid } from 'nanoid'
import * as pathUtil from 'node:path'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import { config } from '../config/app'
import { IParser, Parser } from './parser'

if (require.main === module) {
  main()
}

async function main() {
  const files = globSync('*.md', { cwd: config.graphRoot })
  const paths = files.map(path => pathUtil.join(config.graphRoot, path))
  const parser  = Parser()
  for (const path of paths) {
    compileFile(parser, path)
  }
}

function compileFile(parser: IParser, path: string) {
  const body = fs.readFileSync(path, 'utf-8')
  const name = pathUtil.basename(path, pathUtil.extname(path))
  const node = parser.parse(body, { name, id: nanoid() })
  console.log('compile, %s -> %o', path, node)
}
