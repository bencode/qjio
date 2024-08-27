import { cache } from 'react'
import { BlockRender } from '@/widgets/block-render'
import { loadBlock } from '@/core/loader'
import { createBlockLoader as createDevLoader } from '@/core/dev'
import { Layout } from './_layout'

type PageProps = {
  params: {
    slug: string
  }
  searchParams: Record<string, string>
}

const loadBlockMemo = cache(loadBlock)

export default function Page({ params, searchParams }: PageProps) {
  const loader = searchParams.dev === 'true' ? createDevLoader(params.slug) : loadBlockMemo
  const sider = <div></div>
  const main = <BlockRender name={params.slug} loader={loader} />
  const extra = <div></div>
  return <Layout sider={sider} main={main} extra={extra} />
}
