import type { Block, BlockRef } from '@/core/types'
import { MarkedRender } from './marked-render'
import { CodeRender } from './code-render'
import { CodepenRender } from './codepen-render'
import { RunkitRender } from './runkit-render'
import { BlockProps } from './props'

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
  loader: BlockLoader
}

type BlockLoader = (id: string | undefined, name: string | undefined) => Promise<Block | null>

export const BlockRender = async ({ id, name, loader }: BlockRenderProps) => {
  const block = await loader(id, name)
  if (!block) {
    return <NotFound id={id} name={name} />
  }
  return (
    <article className="px-2 py-4">
      <h2 className="text-3xl mb-4">{block.title}</h2>
      <BlockProps block={block} />
      <BlockComponent block={block} loader={loader} />
    </article>
  )
}

type BlockComponentProps = {
  block: Block
  loader: BlockLoader
}

const BlockComponent = ({ block, loader }: BlockComponentProps) => {
  const Render = getRender(block)
  return (
    <div>
      <Render block={block} />
      {block.children.length > 0 ? (
        <div className="md:pl-4">
          <BlockList items={block.children} loader={loader} />
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
  loader: BlockLoader
}

const BlockList = ({ items, loader }: BlockChildrenProps) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item.type === '$ref' ? (
            <BlockRefComponent block={item as BlockRef} loader={loader} />
          ) : (
            <BlockComponent block={item as Block} loader={loader} />
          )}
        </div>
      ))}
    </div>
  )
}

type BlockRefComponentProps = {
  block: BlockRef
  loader: BlockLoader
}

const BlockRefComponent = async ({ block: ref, loader }: BlockRefComponentProps) => {
  const block = await loader(ref.key, ref.name)
  if (!block) {
    return <NotFound id={ref.key} name={ref.name} />
  }
  return <BlockComponent block={block} loader={loader} />
}

function getRender(block: Block) {
  const render = block.props.render
  if (render) {
    return PropRenders[render as string] || MarkedRender
  }
  return TypeRenders[block.type] || MarkedRender
}
