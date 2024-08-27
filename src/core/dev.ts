import * as pathUtil from 'node:path'
import { readFile } from 'node:fs/promises'
import { config } from '@/config/app'
import { Parser } from './parser'

export function createBlockLoader(filename: string) {
  const parser = Parser()
  return async (_id: string | undefined, name: string | undefined) => {
    const path = pathUtil.join(config.graphRoot, `${filename}.md`)
    const body = await readFile(path, 'utf-8')
    const nextBody = prepocess(body)
    return parser.parse(nextBody, { name: `DEV ${name!}` })
  }
}

function prepocess(body: string) {
  const reImage = /!\[([^\]]+)\]\(([^\)]+)\)/g
  const reRev = /^\.\.\//
  const next = body.replace(reImage, (_: unknown, title: string, url: string) => {
    const assetUrl = `/graph/${url.replace(reRev, '')}`
    return `![title](${assetUrl})`
  })
  return next
}
