import { cache } from 'react'
import { marked } from 'marked'
import { CreateKnexConfig, Knex, createKnex } from '@/utils/knex'
import { config } from '@/config/app'
import { Block, BlockRef } from '@/core/types'

const loadBlockMemo = cache(loadBlock)

const knexRef = { current: null as Knex | null }

type Dict = Record<string, unknown>

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="container">
      <BlockRender name={params.slug} />
    </div>
  )
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
    <div className="q-block">
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

const BlockBody = ({ value }: BlockBodyProps) => {
  const html = marked.parse(value as string)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

type BlockPropsProps = {
  value: Dict
}
const BlockProps = ({ value: props }: BlockPropsProps) => {
  const names = Object.keys(props)
  const renderProp = (value: unknown) => {
    if (typeof value === 'object') {
      return <dd className="object">{JSON.stringify(value)}</dd>
    }
    return <div>{`${value}`}</div>
  }
  return (
    <ul className="q-block-props">
      {names.map((name, index) => (
        <li className="q-block-prop">
          <dl>
            <dt>{name}:</dt>
            {renderProp(props[name])}
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
    <div className="q-block-list">
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

function getKnex() {
  if (!knexRef.current) {
    const opts = {
      client: 'pg',
      debug: true,
      ...config.db,
    } as CreateKnexConfig
    knexRef.current = createKnex(opts)
  }
  return knexRef.current!
}

async function loadBlock(key: string | undefined, name: string | undefined) {
  const knex = getKnex()
  const where = key ? { key } : { name: name || 'not-found' }
  const list = await knex('blocks').where(where).limit(1)
  return list.length > 0 ? (list[0] as Block) : null
}
