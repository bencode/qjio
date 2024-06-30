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

export default async function Page({ params, searchParams }: PageProps) {
  const loader = searchParams.dev ? createBlockLoader(searchParams.dev) : loadBlockMemo
  const sider = <div></div>
  const main = <BlockRender name={params.slug} loader={loader} />
  const extra = <div></div>
  return <Layout sider={sider} main={main} extra={extra} />
}

function createBlockLoader(filename: string) {
  const parser = Parser()
  return async (id: string | undefined, name: string | undefined) => {
    const path = pathUtil.join(config.graphRoot, `${filename}.md`)
    const body = await readFile(path, 'utf-8')
    return parser.parse(body, { name: `DEV ${name!}` })
  }
}
