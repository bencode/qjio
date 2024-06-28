import { cache } from 'react'
import type { Block, BlockRef } from '@/core/types'
import { getKnex } from '@/core/knex'
import { MarkedRender } from './marked-render'
import { CodeRender } from './code-render'
import { CodepenRender } from './codepen-render'
import { RunkitRender } from './runkit-render'
import { BlockProps } from './props'

const loadBlockMemo = cache(loadBlock)

const TypeRenders = {
  code: CodeRender,
} as Record<string, React.ComponentType<any>>

const PropRenders = {
  codepen: CodepenRender,
  runkit: RunkitRender,
} as Record<string, React.ComponentType<any>>

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
      <h2 className="text-3xl mb-4">{block.title}</h2>
      <BlockProps block={block} />
      <BlockComponent block={block} />
    </article>
  )
}

type BlockComponentProps = {
  block: Block
}

const BlockComponent = ({ block }: BlockComponentProps) => {
  const Render = getRender(block)
  return (
    <div>
      <Render block={block} />
      {block.children.length > 0 ? (
        <div className="md:pl-4">
          <BlockList items={block.children} />
        </div>
      ) : null}
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

function getRender(block: Block) {
  const render = block.props.render
  if (render) {
    return PropRenders[render as string] || MarkedRender
  }
  return TypeRenders[block.type] || MarkedRender
}
