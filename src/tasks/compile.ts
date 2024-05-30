import 'dotenv/config'
import * as pathUtil from 'node:path'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import type { CreateKnexConfig } from '../utils/knex'
import { withKnex, Knex } from '../utils/knex'
import { config } from '../config/app'
import type { Block, BlockRef } from '../core/types'
import { IParser, Parser } from './parser'

if (require.main === module) {
  main()
}

async function main() {
  const files = globSync('*.md', { cwd: config.graphRoot })
  const paths = files.map(path => pathUtil.join(config.graphRoot, path))
  const parser  = Parser()

  const opts = {
    client: 'pg',
    debug: true,
    ...config.db,
  } as CreateKnexConfig
  await withKnex(opts, async knex => {
    for (const path of paths) {
      await compileFile(knex, parser, path)
    }
  })

}

async function compileFile(knex: Knex, parser: IParser, path: string) {
  const body = fs.readFileSync(path, 'utf-8')
  const name = pathUtil.basename(path, pathUtil.extname(path))
  const root = parser.parse(body, { name })
  const blocks = flattenNode(root)
  for (const block of blocks) {
    global.console.debug('create block: %o', block)
    const where = block.name ? { name: block.name } : { key: block.key }
    const list = await knex('blocks').where(where).limit(1)
    const data = {
      ...block,
      props: JSON.stringify(block.props),
      children: JSON.stringify(block.children),
      refs: JSON.stringify(block.refs),
    }
    if (list.length > 0) {
      await knex('blocks').where({ id: list[0].id }).update(data)
    } else {
      await knex('blocks').insert(data)
    }
  }
}

function flattenNode(root: Block) {
  const list: Block[] = []
  const tr = (node: Block): Block | BlockRef => {
    const children = node.children?.map(child => {
      if (child.type === '$ref') {
        return child as BlockRef
      }
      const next = tr(child as Block)
      if (next.key || next.name) {
        return { type: '$ref', key: next.key, name: next.name } as BlockRef
      }
      return next
    })

    const next: Block = { ...node, children }
    if (node.key || node.name) {
      list.push(next)
    }
    return next
  }
  tr(root)
  return list
}
