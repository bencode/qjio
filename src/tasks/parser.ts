import createDebug from 'debug'
import markdown from 'markdown-it'
import type { Block } from '../core/types'

const debug = createDebug('parser')

type ParseOptions = {
  id: string
  name: string
}

type Node = {
  type: string
  tag: string
  content: string
  level: number
}

export function parse(body: string, opts: ParseOptions) {
  const md = markdown()
  const nodes = md.parse(body, {})

  if (nodes.length > 0) {
    return parseNodes(nodes, 0, { id: opts.id, name: opts.name })
  }

  const empty: Block= {
    id: opts.id,
    name: opts.name,
    type: 'document',
    props: {},
    body: null,
    children: [],
  }
  return empty
}

const elementsTable: Record<string, ParseElementFn> = {
  'paragraph_open': 
}

type VisitFn = (nodes: Node[], index: number, block: Block) => number

function parseNodes(nodes: Node[], index: number, opts: { id: string; name: string }) {
  const node = nodes[index]
  const fn = VisitTable[node?.type] ?? skip
  const next = fn(nodes, index, block)
  if (next >= 0 && next < nodes.length) {
    parseNodes(nodes, next, block)
  }
}

function visitP(nodes: Node[], index: number, block: Block) {
  const node = nodes[index]
  debug('visit p', node)

  return index + 1
}

function skip(nodes: Node[], index: number, block: Block) {
  const node = nodes[index]
  debug('skip %s | %s', node.type, node.tag)
  return index + 1
}
