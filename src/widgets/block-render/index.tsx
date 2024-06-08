import { cache } from 'react'
import { marked } from 'marked'
import type { Dict, Block, BlockRef } from '@/core/types'
import { getKnex } from '@/core/knex'

const loadBlockMemo = cache(loadBlock)

export type BlockRenderProps = {
  id?: string
  name?: string
}

export const BlockRender = async ({ id, name }: BlockRenderProps) => {
  const block = await loadBlockMemo(id, name)
  if (!block) {
    return <NotFound id={id} name={name} />
  }
  return (
    <article className="px-2 py-4">
      <BlockComponent block={block} />
    </article>
  )
}

type BlockComponentProps = {
  block: Block
}

const BlockComponent = ({ block }: BlockComponentProps) => {
  return (
    <div>
      {block.body ? <BlockBody value={block.body as string} /> : null}
      {Object.keys(block.props).length > 0 ? <BlockProps value={block.props} /> : null}
      {block.children.length > 0 ? <BlockList items={block.children} /> : null}
    </div>
  )
}

type NotFoundProps = {
  id?: string
  name?: string
}

const NotFound = ({ id, name }: NotFoundProps) => {
  return <div>not found: {id ?? name}</div>
}

type BlockBodyProps = {
  value: string
}

const BlockBody = async ({ value }: BlockBodyProps) => {
  const refs = parseBodyRefs(value)
  const nameBlocks = refs.nameRefs?.length > 0 ? await loadNameBlocks(refs.nameRefs) : []
  const idBlocks = refs.idRefs?.length > 0 ? await loadIdBlocks(refs.idRefs) : []
  const md = processBody(nameBlocks, idBlocks, value)
  console.log(md)
  const html = marked.parse(md)
  return (
    <div className="prose prose-blue max-w-none">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

type BlockPropsProps = {
  value: Dict
}
const BlockProps = ({ value: props }: BlockPropsProps) => {
  const names = Object.keys(props)
  const renderProp = (value: unknown) => {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return `${value}`
  }
  return (
    <ul className="rounded bg-slate-100 px-4 py-2">
      {names.map((name, index) => (
        <li key={index}>
          <dl className="flex flex-row">
            <dt>{name}:</dt>
            <dd className="ml-2">{renderProp(props[name])}</dd>
          </dl>
        </li>
      ))}
    </ul>
  )
}

type BlockChildrenProps = {
  items: (Block | BlockRef)[]
}

const BlockList = ({ items }: BlockChildrenProps) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item.type === '$ref' ? (
            <BlockRefComponent block={item as BlockRef} />
          ) : (
            <BlockComponent block={item as Block} />
          )}
        </div>
      ))}
    </div>
  )
}

type BlockRefComponentProps = {
  block: BlockRef
}

const BlockRefComponent = async ({ block: ref }: BlockRefComponentProps) => {
  const block = await loadBlockMemo(ref.key, ref.name)
  if (!block) {
    return <NotFound id={ref.key} name={ref.name} />
  }
  return <BlockComponent block={block} />
}

async function loadBlock(key: string | undefined, name: string | undefined) {
  const knex = getKnex()
  const where = key ? { key } : { name: name || 'not-found' }
  const list = await knex('blocks').where(where).limit(1)
  return list.length > 0 ? (list[0] as Block) : null
}

async function loadNameBlocks(names: string[]) {
  const knex = getKnex()
  const list = await knex('blocks')
    .select(['name', 'title'])
    .whereIn('title', names)
    .orWhereIn('name', names)
  return list as NameBlockBrief[]
}

async function loadIdBlocks(ids: string[]) {
  const knex = getKnex()
  const list = await knex('blocks').select(['key', 'title']).whereIn('key', ids)
  return list as IdBlockBrief[]
}

function parseBodyRefs(body: string) {
  const reName = /\[\[([^\]]+)\]\]/g
  const reId = /\(\(([^\)]+)\)\)/g
  const nameGroups = body.matchAll(reName)
  const nameRefs = Array.from(nameGroups).map(v => v[1])
  const idGroups = body.matchAll(reId)
  const idRefs = Array.from(idGroups).map(v => v[1])
  return { nameRefs, idRefs }
}

type NameBlockBrief = {
  name: string
  title: string
}

type IdBlockBrief = {
  key: string
  title: string
}

function processBody(nameBlocks: NameBlockBrief[], _idBlocks: IdBlockBrief[], md: string) {
  const reName = /(#?)\[\[([^\]]+)\]\]/g
  const next = md.replace(reName, (_: unknown, mark: string, title: string) => {
    const block = nameBlocks.find(v => v.title === title)
    const name = block ? block.name : title
    const url = `/pages/${name}`
    return `[${mark}\\[\\[${title}\\]\\]](${url})`
  })
  return next
}
