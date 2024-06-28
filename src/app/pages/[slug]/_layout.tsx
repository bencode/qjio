import { CodePenScript } from '@/components/code-pen'
import { RunkitScript } from '@/components/runkit'

type LayoutProps = {
  sider: React.ReactElement
  main: React.ReactElement
  extra: React.ReactElement
}

export const Layout = ({ sider: _sider, main, extra: _extra }: LayoutProps) => {
  return (
    <div className="container mx-auto h-screen">
      <div className="flex-1">{main}</div>
      <CodePenScript />
      <RunkitScript />
    </div>
  )
}
