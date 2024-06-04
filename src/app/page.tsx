import { BlockRender } from '@/widgets/block-render'

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
      <div className="prose">
        <pre>() =&gt; study(math) =&gt; practice(code)</pre>
      </div>
      <BlockRender name="contents" />
    </div>
  )
}
