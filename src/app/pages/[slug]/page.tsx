import { cache } from 'react'
import { BlockRender } from '@/widgets/block-render'
import type { Dict } from '../../../core/types'
import { loadBlock } from '../../../core/loader'
import { Layout } from './_layout'

type PageProps = {
  params: {
    slug: string
  }
  searchParams: Dict
}

const loadBlockMemo = cache(loadBlock)

export default async function Page({ params, searchParams }: PageProps) {
  console.log('------', searchParams)
  const sider = <div></div>
  const main = <BlockRender name={params.slug} loader={loadBlockMemo} />
  const extra = <div></div>
  return <Layout sider={sider} main={main} extra={extra} />
}
