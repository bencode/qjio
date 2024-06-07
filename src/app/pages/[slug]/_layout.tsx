'use client'

import Split from 'react-split'

type LayoutProps = {
  sider: React.ReactElement
  main: React.ReactElement
  extra: React.ReactElement
}

export const Layout = ({ sider, main, extra }: LayoutProps) => {
  return (
    <div className="h-screen">
      <Split className="qx-split h-full overflow-auto flex" sizes={[20, 60, 20]} gutterSize={2}>
        <div className="sticky top-[0] bg-slate-50">{sider}</div>
        <div className="px-2 py-4">{main}</div>
        <div className="sticky top-[0] bg-slate-50">{extra}</div>
      </Split>
    </div>
  )
}
