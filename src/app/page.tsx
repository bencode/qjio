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
      <h1>study(math) =&gt; practice(code)</h1>
      <BlockRender name="contents" />
    </div>
  )
}
