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

type Dict = Record<string, unknown>

export function parse(body: string, opts: ParseOptions) {
  const md = markdown()
  const nodes = md.parse(body, {})

  if (nodes.length > 0) {
    return parseBlock(nodes, { id: opts.id, name: opts.name })
  }

  const empty: Block= {
    id: opts.id,
    name: opts.name,
    type: 'document',
    props: {},
    body: [],
    refs: [],
  }
  return empty
}

function parseBlock(nodes: Node[], opts: { id: string; name: string }) {
  const [props, next] = parseBlockProps(nodes)
  const block: Block = {
    id: props.id as string ?? opts.id,
    name: props.name as string ?? opts.name,
    type: 'document',
    props,
    body: [],
    refs: [],
  }
  console.log(block)
  return nodes
}

function parseBlockProps(nodes: Node[]): [Dict, number] {
  const first = nodes[0]
  if (first?.type !== 'paragraph_open') {
    return [{}, 0]
  }
  const index = findNodeIndex(nodes, 1, 'paragraph_close', first.level)
  if (index === -1) {
    globalThis.console.error('can not find close tag for: %o', first)
    // skip open p
    return [{}, 1]
  }

  const inline = getFirstNode(nodes, 1, 'inline')
  if (!inline) {
    return [{}, index + 1]
  }

  const props = parseProps(inline.content || '')
  return [props, index + 1]
}

function getFirstNode(nodes: Node[], from: number, type: string, level?: number) {
  const index = findNodeIndex(nodes, from, type, level)
  return index >= 0 ? nodes[index] : null
}

function findNodeIndex(nodes: Node[], from: number, type: string, level?: number) {
  for (let i = from; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.type === type && (level === undefined || node.level === level)) {
      return i
    }
  }
  return -1
}

function parseProps(content: string) {
  const re = /^([-\w]+)::(.*)$/
  const list = content.split(/\n/)
  return list.reduce((acc, line) => {
    const m = re.exec(line)
    if (m) {
      acc[m[1]] = parseValue(m[2].trim())
    }
    return acc
  }, {} as Dict)
}

function parseValue(value: string) {
  if (value === '') {
    return null
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  if (value === 'null') {
    return null
  }
  if (value === 'undefined') {
    return undefined
  }
  const reNum = /^(\d+)?(?:\.(\d+))?$/
  if (reNum.test(value)) {
    return parseInt(value, 10)
  }
  return value
}
