'use client'

import { useEffect, useRef } from 'react'
import type { Block } from '@/core/types'
import 'highlight.js/styles/github.css'

export type CodeRenderProps = {
  block: Block
}

export const CodeRender = ({ block }: CodeRenderProps) => {
  const ref = useRef<HTMLPreElement>(null)
  useEffect(() => {
    const load = async () => {
      const hjs = await import('highlight.js')
      hjs.default.highlightElement(ref.current!)
    }
    load()
  }, [])

  return (
    <div className="bg-white px-2 py-1 text-sm">
      <pre ref={ref} className="code hjs language-javascript">
        {block.body}
      </pre>
    </div>
  )
}
