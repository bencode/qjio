'use client'

import { useEffect } from 'react'
import { loadScript } from '../utils/script'

export const CodePenScript = () => {
  useEffect(() => {
    const url = 'https://cpwebassets.codepen.io/assets/embed/ei.js'
    loadScript(url).then(() => {
      window.console.debug('codepen lib loaded')
    })
  }, [])
  return null
}
