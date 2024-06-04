import { BlockRender } from '@/widgets/block-render'

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto p-4">
      <BlockRender name={params.slug} />
    </div>
  )
}
