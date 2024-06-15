import type { Block } from '@/core/types'

export type CodepenRenderProps = {
  block: Block
}

export const CodepenRender = ({ block }: CodepenRenderProps) => {
  const reLink = /\[([^\]]+)\]\(([^\)]+)\)/
  const match = reLink.exec(block.body || '')
  if (!match) {
    return null
  }
  const reSlug = /\/pen\/([-\w]+)/
  const slugMatch = reSlug.exec(match[2])
  if (!slugMatch) {
    return null
  }
  const title = match[1]
  const slug = slugMatch[1]
  return (
    <div
      className="codepen"
      data-height="400"
      data-default-tab="result"
      data-slug-hash={slug}
      data-pen-title={title}
      data-preview="false"
      data-editable="true"
      data-user="bencode"
      style={{
        height: '300px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid',
        margin: '1em 0',
        padding: '1em',
      }}
    />
  )
}
