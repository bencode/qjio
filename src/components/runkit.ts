'use client'

import { useEffect } from 'react'
import { loadScript } from '../utils/script'

export const RunkitScript = () => {
  useEffect(() => {
    const url = 'https://embed.runkit.com'
    loadScript(url).then(() => {
      window.console.debug('runkit loaded')
    })
  }, [])
  return null
}
