import { BlockRender } from '@/widgets/block-render'

export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <main>
      <Contents />
    </main>
  )
}

async function Contents() {
  return (
    <div className="container mx-auto">
      <h1>
        <code>() =&gt; study(math) =&gt; practice(code)</code>
      </h1>
      <BlockRender name="contents" />
    </div>
  )
}
