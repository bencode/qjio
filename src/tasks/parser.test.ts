import * as pathUtil from 'node:path'
import * as fs from 'node:fs/promises'
import { test, expect } from 'vitest'
import { Parser } from './parser'

test('parse', async () => {
  const path = pathUtil.join(process.cwd(), 'graph/pages/parser-fixture-1.md')
  const body = await fs.readFile(path, 'utf-8')
  const name = pathUtil.basename(path, pathUtil.extname(path))
  const parser = Parser()
  const node = parser.parse(body, { name })
  expect(node.type).toBe('document')
  // await fs.writeFile('test.json', JSON.stringify(node, null, 2))
})
