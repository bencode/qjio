import { Block } from '@/core/types'
import { getKnex } from '@/core/knex'
import { MarkedBody } from '@/components/marked-body'

export type MarkedRenderProps = {
  block: Block
}

export const MarkedRender = ({ block }: MarkedRenderProps) => {
  const body = block.body as string
  return body ? <BlockBody value={block.body as string} /> : null
}

type BlockBodyProps = {
  value: string
}

const BlockBody = async ({ value }: BlockBodyProps) => {
  const refs = parseBodyRefs(value)
  const nameBlocks = refs.nameRefs?.length > 0 ? await loadNameBlocks(refs.nameRefs) : []
  const idBlocks = refs.idRefs?.length > 0 ? await loadIdBlocks(refs.idRefs) : []
  const md = processBody(nameBlocks, idBlocks, value)
  return <MarkedBody value={md} />
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
