import type { Block } from '@/core/types'
import { MarkedBody } from '@/components/marked-body'

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
    <div>
      <MarkedBody value={block.body!} />
      <div className="hidden md:block">
        <div
          className="codepen"
          data-height="400"
          data-default-tab="js,result"
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
      </div>
    </div>
  )
}
