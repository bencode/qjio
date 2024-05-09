import markdown from 'markdown-it'
import * as pathUtil from 'node:path'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import { config } from '../config/app'

if (require.main === module) {
  main()
}

async function main() {
  const files = globSync('*.md', { cwd: config.graphRoot })
  const paths = files.map(path => pathUtil.join(config.graphRoot, path))
  for (const path of paths) {
    compileFile(path)
  }
}

function compileFile(path: string) {
  const body = fs.readFileSync(path, 'utf-8')
  const node = parse(body)
  // const filename = pathUtil.basename(path, pathUtil.extname(path))
  // fs.writeFileSync(`build/${filename}.json`, JSON.stringify(nodes))
}

function parse(body: string) {
  const md = markdown()
  const nodes = md.parse(body, {})
  //console.log(nodes)
}
