'use client'

import { useEffect } from 'react'

export const CodePen = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cpwebassets.codepen.io/assets/embed/ei.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div
      className="codepen"
      data-height="400"
      data-default-tab="result"
      data-slug-hash="QWPBvKg"
      data-pen-title="hello-webgl"
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
