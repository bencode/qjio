import { BlockRender } from '@/widgets/block-render'
import { Layout } from './_layout'

export default async function Page({ params }: { params: { slug: string } }) {
  const sider = <div></div>
  const main = <BlockRender name={params.slug} />
  const extra = <div></div>
  return <Layout sider={sider} main={main} extra={extra} />
}
