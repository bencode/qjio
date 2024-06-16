import type { Block, BlockRef } from '@/core/types'
import { isObject } from '../../utils/lang'

export type BlockPropsProps = {
  block: Block
}

export const BlockProps = ({ block }: BlockPropsProps) => {
  const props = block.props || {}
  const names = Object.keys(props)
  if (names.length === 0) {
    return null
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

function renderProp(value: unknown) {
  if (isBlockRef(value)) {
    if (value.name) {
      const url = `/pages/${value.name}`
      return (
        <a href={url} className="text-blue-600 hover:text-blue-700">
          [[{value.name}]]
        </a>
      )
    }
  }
  if (isObject(value)) {
    return <div>`${JSON.stringify(value)}`</div>
  }
  return `${value}`
}

function isBlockRef(value: unknown): value is BlockRef {
  const maybe = value as { type: string }
  return maybe?.type === '$ref'
}
