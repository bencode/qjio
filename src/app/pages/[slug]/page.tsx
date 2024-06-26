import { cache } from 'react'
import * as pathUtil from 'node:path'
import { readFile } from 'node:fs/promises'
import { BlockRender } from '@/widgets/block-render'
import { config } from '@/config/app'
import { loadBlock } from '@/core/loader'
import { Parser } from '@/core/parser'
import { Layout } from './_layout'

type PageProps = {
  params: {
    slug: string
  }
  searchParams: Record<string, string>
}

const loadBlockMemo = cache(loadBlock)

export default function Page({ params, searchParams }: PageProps) {
  const loader = searchParams.dev ? createBlockLoader(searchParams.dev) : loadBlockMemo
  const sider = <div></div>
  const main = <BlockRender name={params.slug} loader={loader} />
  const extra = <div></div>
  return <Layout sider={sider} main={main} extra={extra} />
}

function createBlockLoader(filename: string) {
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
