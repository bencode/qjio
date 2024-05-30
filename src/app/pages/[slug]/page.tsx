import { cache } from 'react'
import { Knex, createKnex } from '@/utils/knex'
import { config } from '@/config/app'
import { Block, BlockRef } from '@/core/types'

const loadBlockMemo = cache(loadBlock)

const knexRef = { current: null as Knex | null }

export default async function Page({ params }: { params: { slug: string } }) {
  return <BlockRender name={params.slug} />
}

export type BlockRenderProps = {
  id?: string
  name?: string
}

const BlockRender = async ({ id, name }: BlockRenderProps) => {
  const block = await loadBlockMemo(id, name)
  if (!block) {
    return <NotFound id={id} name={name} />
  }
  return <BlockComponent block={block} />
}

type BlockComponentProps = {
  block: Block
}

const BlockComponent = ({ block }: BlockComponentProps) => {
  return (
    <div>
      {block.body ? <BlockBody value={block.body as string} /> : null}
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

const BlockBody = ({ value }: BlockBodyProps) => {
  return <div>{value}</div>
}

type BlockChildrenProps = {
  items: (Block | BlockRef)[]
}

const BlockList = ({ items }: BlockChildrenProps) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.type === '$ref' ? (
            <BlockRefComponent block={item as BlockRef} />
          ) : (
            <BlockComponent block={item as Block} />
          )}
        </li>
      ))}
    </ul>
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

function getKnex() {
  if (!knexRef.current) {
    knexRef.current = createKnex({
      client: 'pg',
      debug: true,
      ...config.db,
    })
  }
  return knexRef.current!
}

async function loadBlock(key: string | undefined, name: string | undefined) {
  const knex = getKnex()
  const where = key ? { key } : { name: name || 'not-found' }
  const list = await knex('blocks').where(where).limit(1)
  return list.length > 0 ? (list[0] as Block) : null
}
