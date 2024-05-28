import createDebug from 'debug'
import markdown from 'markdown-it'
import type { Block, BlockRef } from '../core/types'
import { parseValue } from './value'

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

export function Parser() {
  const parse = (body: string, opts: ParseOptions) => {
    const md = markdown()
    const nodes = md.parse(body, {})

    if (nodes.length > 0) {
      return parseDocBlock(nodes, { id: opts.id, name: opts.name })
    }

    const empty: Block= {
      id: opts.id,
      name: opts.name,
      type: 'document',
      props: {},
      body: undefined,
      children: [],
      refs: [],
    }
    return empty
  }

  return { parse }
}

type ParserContext = {
  names: Set<string>
  ids: Set<string>
}

function parseDocBlock(nodes: Node[], opts: { id: string; name: string }) {
  const names = new Set<string>()
  const ids = new Set<string>()
  const ctx = {
    names,
    ids,
  }
  const props = parseBlockProps(nodes, 0)
  const lis = findEncludeNodeGroup(nodes, 'list_item', 1)
  const children = lis.map(li => parseBlock(li, 1, ctx)).filter(v => v)
  const refs = createRefs(ctx)
  const block: Block = {
    id: props.id as string ?? opts.id,
    name: props.name as string ?? opts.name,
    type: 'document',
    body: '',
    props,
    children,
    refs,
  }

  console.log('%o', block)
  return nodes
}

// > paragraph
function parseBlockProps(nodes: Node[], level: number) {
  const propNodes = findEncludeNode(nodes, 'paragraph', level)
  if (propNodes) {
    const inline = findChildNode(propNodes, 'inline')
    return inline ? parseProps(inline.content || '') : {}
  }
  return {}
}

// list_item
function parseBlock(nodes: Node[], level: number, ctx: ParserContext) {
  const bodyNodes = findEncludeNode(nodes, 'paragraph', level + 1)
  const body = bodyNodes ? parseBlockBody(bodyNodes, level + 1) : ''
  const lis = findEncludeNodeGroup(nodes, 'list_item', level + 2)
  const props = lis.length > 0 ? parseBlockProps(lis[0], level + 3) : {}
  const childNodes = Object.keys(props).length > 0 ? lis.slice(1) : lis
  const children = childNodes.map(li => parseBlock(li, level + 2, ctx)).filter(v => v)

  const block: Block = {
    type: 'text',
    props,
    body,
    children,
    refs: []
  }
  return block
}

function parseBlockBody(nodes: Node[], _level: number) {
  const inline = findChildNode(nodes, 'inline')
  return inline?.content || ''
}

function findChildNode(nodes: Node[], type: string) {
  const level = nodes[0]?.level
  return nodes.find(v => v.type === type && v.level === level + 1)
}

function findEncludeNodeGroup(list: Node[], type: string, level: number) {
  const group: Node[][] = []
  let start = findIndex(list, 0, `${type}_open`, level)
  while (start !== -1) {
    const end = findIndex(list, start + 1, `${type}_close`, level)
    if (end !== -1) {
      group.push(list.slice(start, end + 1))
    }
    start = findIndex(list, start + 1, `${type}_open`, level)
  }
  return group
}

function findEncludeNode(list: Node[], type: string, level: number) {
  const start = findIndex(list, 0, `${type}_open`, level)
  if (start === -1) {
    return null
  }
  const end = findIndex(list, start + 1, `${type}_close`, level)
  if (end === -1) {
    return null
  }
  return list.slice(start, end + 1)
}

function findIndex(list: Node[], start: number, type: string, level: number) {
  for (let i = start; i < list.length; i++) {
    const node = list[i]
    if (node.type === type && node.level === level) {
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

function createRefs(ctx: ParserContext) {
  const nameRefs = Array.from(ctx.names.values()).map(name => ({ type: '$ref', name }))
  const idRefs = Array.from(ctx.ids.values()).map(id => ({ type: '$ref', id }))
  return [...nameRefs, ...idRefs] as BlockRef[]
}
