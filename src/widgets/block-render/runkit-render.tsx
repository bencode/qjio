'use client'

import { useEffect, useRef } from 'react'
import { loadScript } from '../../utils/script'
import { Block } from '@/core/types'

export type RunkitRenderProps = {
  block: Block
}

export const RunkitRender = ({ block }: RunkitRenderProps) => {
  const elRef = useRef<HTMLDivElement>(null)
  const initedRef = useRef(false)
  useEffect(() => {
    if (initedRef.current) {
      return
    }
    initedRef.current = true

    const load = async () => {
      const url = 'https://embed.runkit.com'
      await loadScript(url)
      const RunKit = (window as any).RunKit
      RunKit.createNotebook({
        element: elRef.current,
        source: block.body,
      })
    }
    load().catch(e => {
      window.console.error(e)
    })
  }, [block.body])

  return (
    <div>
      <div ref={elRef}></div>
    </div>
  )
}
