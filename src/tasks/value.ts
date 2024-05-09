import type { BlockRef } from '../core/types'

export function parseValue(value: string) {
  // #[[name]] ((id)) other
  const re = /(?:#\[\[([^\]]+)\]\])|(?:\(\((\w+)\)\))|([\S]+)/g
  const groups = Array.from(value.matchAll(re))
  const result = groups.map(match => {
    if (match[1]) {
      return { type: '$ref', name: match[1] } as BlockRef
    }
    if (match[2]) {
      return { type: '$ref', id: match[2] } as BlockRef
    }
    return parseItem(match[3])
  })

  if (result.length === 0) {
    return null
  }

  return result.length === 1 ? result[0] : result
}

function parseItem(value: string) {
  if (value === '') {
    return null
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  if (value === 'null') {
    return null
  }
  if (value === 'undefined') {
    return undefined
  }
  const reNum = /^(\d+)?(?:\.(\d+))?$/
  if (reNum.test(value)) {
    return parseInt(value, 10)
  }
  return value
}
