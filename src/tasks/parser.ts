// import createDebug from 'debug'
import markdown from 'markdown-it'
import type { Block, BlockRef } from '../core/types'
import { parseValue, parseRefs } from './value'

// const debug = createDebug('parser')

type ParseOptions = {
  name: string
}

type Node = {
  type: string
  tag: string
  content: string
  level: number
}

type Dict = Record<string, unknown>

export type IParser = {
  parse: (body: string, opts: ParseOptions) => Block
}

export function Parser() {
  const parse = (body: string, opts: ParseOptions): Block => {
    const md = markdown()
    const nodes = md.parse(body, {})
    if (nodes.length > 0) {
      return parseDocBlock(nodes, { name: opts.name })
    }

    const empty: Block = {
      key: undefined,
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
  keys: Set<string>
}

function parseDocBlock(nodes: Node[], opts: { name: string }) {
  const props = parseBlockProps(nodes, 0)
  const lis = findEncloseNodeGroup(nodes, 'list_item', 1)
  const children = lis.map(li => parseBlock(li, 1)).filter(v => v) as Block[]
  const { name, ...extraProps } = props
  const blockName = name ? (name as string) : opts.name
  const title = name ? opts.name : undefined
  const block: Block = {
    key: undefined,
    name: blockName,
    title,
    type: 'document',
    body: '',
    props: extraProps,
    children,
    refs: [],
  }
  // console.log(JSON.stringify(block, null, '  '))
  return block
}

// > paragraph
function parseBlockProps(nodes: Node[], level: number) {
  const { nodes: propNodes } = findEncloseNode(nodes, 'paragraph', level)
  if (!propNodes) {
    return {}
  }
  const inline = findChildNode(propNodes, 'inline')
  if (!inline) {
    return {}
  }
  const { props } = parseContent(inline.content || '')
  return props
}

// list_item
function parseBlock(nodes: Node[], level: number) {
  const { block, next } = parseMainBlock(nodes, level)
  if (!block) {
    return null
  }

  const children = next < nodes.length - 1 ? parseSibling(nodes.slice(next), level) : []
  const nblock: Block = {
    ...block,
    children: [...block.children, ...children],
  }
  return nblock
}

function parseMainBlock(nodes: Node[], level: number) {
  const { node: codeNode, next: codeNext } = findSingleNode(nodes, 'fence', level + 1)
  if (codeNode) {
    const block = parseCodeBlock(codeNode, nodes.slice(0, codeNext - 1), level + 1)
    return { block, next: codeNext }
  }

  const { nodes: textNodes, next: textNext } = findOneEncloseNode(
    nodes,
    ['heading', 'paragraph'],
    level + 1,
  )
  if (textNodes) {
    const block = parseTextBlock(textNodes, level)
    return { block, next: textNext }
  }

  return { block: null, next: 0 }
}

function parseSibling(nodes: Node[], level: number) {
  const lis = findEncloseNodeGroup(nodes, 'list_item', level + 2)
  return lis.map(li => parseBlock(li, level + 2)).filter(v => v) as Block[]
}

function parseCodeBlock(node: Node, nodes: Node[], level: number) {
  const props = parseBlockProps(nodes, level)
  const maybe = node as unknown as { info: string }
  const block: Block = {
    type: 'code',
    key: props.id as string,
    props: {
      ...props,
      lang: maybe.info,
    },
    body: node.content,
    children: [],
    refs: [],
  }
  return block
}

function parseTextBlock(nodes: Node[], level: number) {
  const ctx = {
    names: new Set<string>(),
    keys: new Set<string>(),
  }

  const { body, props: allProps } = parseBlockContent(nodes, level + 1, ctx)
  const { type, id, ...props } = allProps
  const lis = findEncloseNodeGroup(nodes, 'list_item', level + 2)
  const children = lis.map(li => parseBlock(li, level + 2)).filter(v => v) as Block[]
  const nextBody = nodes ? wrapBody(nodes[0], body) : body
  const block: Block = {
    type: (type || 'text') as string,
    key: id as string,
    // name: name as string,
    props,
    body: nextBody,
    children,
    refs: createRefs(ctx),
  }

  return block
}

function wrapBody(node: Node, body: string) {
  const tpls: Record<string, string> = {
    h1: '#',
    h2: '##',
    h3: '###',
    h4: '####',
    h5: '#####',
  }
  const tpl = tpls[node.tag]
  return tpl ? `${tpl} ${body}` : body
}

// paragraph
function parseBlockContent(nodes: Node[], _level: number, ctx: ParserContext) {
  const inline = findChildNode(nodes, 'inline')
  const refs = parseRefs(inline?.content || '')
  refs.forEach(ref => {
    if (ref.name) {
      ctx.names.add(ref.name)
    }
    if (ref.key) {
      ctx.keys.add(ref.key)
    }
  })
  return parseContent(inline?.content || '')
}

function findOneEncloseNode(nodes: Node[], types: string[], level: number) {
  for (const type of types) {
    const ret = findEncloseNode(nodes, type, level)
    if (ret.nodes) {
      return ret
    }
  }
  return { nodes: null, next: 0 }
}

function findSingleNode(nodes: Node[], type: string, level: number) {
  const start = findIndex(nodes, 0, type, level)
  if (start !== -1) {
    return { node: nodes[start], next: start + 1 }
  }
  return { node: null, next: 0 }
}

function findChildNode(nodes: Node[], type: string) {
  const level = nodes[0]?.level
  return nodes.find(v => v.type === type && v.level === level + 1)
}

function findEncloseNodeGroup(list: Node[], type: string, level: number) {
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

function findEncloseNode(list: Node[], type: string, level: number) {
  const start = findIndex(list, 0, `${type}_open`, level)
  if (start === -1) {
    return { nodes: null, next: 0 }
  }
  const end = findIndex(list, start + 1, `${type}_close`, level)
  if (end === -1) {
    return { nodes: null, next: 0 }
  }
  const nodes = list.slice(start, end + 1)
  return { nodes, next: end + 1 }
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

function parseContent(content: string) {
  const re = /^([-\w]+)::(.*)$/
  const lines = content.split(/\n/)
  const body: string[] = []
  const props: Dict = {}
  lines.forEach(line => {
    const m = re.exec(line)
    if (m) {
      props[m[1]] = parseValue(m[2].trim())
    } else {
      body.push(line)
    }
  })
  return { body: body.join('\n'), props }
}

function createRefs(ctx: ParserContext) {
  const nameRefs = Array.from(ctx.names.values()).map(name => ({ type: '$ref', name }))
  const keyRefs = Array.from(ctx.keys.values()).map(key => ({ type: '$ref', key }))
  return [...nameRefs, ...keyRefs] as BlockRef[]
}
