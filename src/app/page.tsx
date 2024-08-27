import { cache } from 'react'
import { BlockRender } from '@/widgets/block-render'
import { loadBlock } from '@/core/loader'
import { createBlockLoader as createDevLoader } from '@/core/dev'

const loadBlockMemo = cache(loadBlock)

export const dynamic = 'force-dynamic'

type HomeProps = {
  searchParams: Record<string, string>
}

type BlockLoader = typeof loadBlock

export default async function Home({ searchParams }: HomeProps) {
  const loader = searchParams.dev === 'true' ? createDevLoader('contents') : loadBlockMemo
  return (
    <main>
      <Contents loader={loader} />
    </main>
  )
}

type ContentsProps = {
  loader: BlockLoader
}

async function Contents({ loader }: ContentsProps) {
  return (
    <div className="container mx-auto">
      <h1>
        <code>() =&gt; study(math) =&gt; practice(code)</code>
      </h1>
      <BlockRender name="contents" loader={loader} />
    </div>
  )
}
