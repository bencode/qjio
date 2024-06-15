'use client'

import { useEffect } from 'react'

export const CodePenScript = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cpwebassets.codepen.io/assets/embed/ei.js'
    script.async = true
    document.body.appendChild(script)
  }, [])
  return null
}
