type LayoutProps = {
  sider: React.ReactElement
  main: React.ReactElement
  extra: React.ReactElement
}

export const Layout = ({ sider, main, extra }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-auto">
      <div className="sticky top-[0] bg-slate-50 w-64 hidden md:flex">{sider}</div>
      <div className="flex-1">{main}</div>
      <div className="sticky top-[0] bg-slate-50 w-64 hidden md:flex">{extra}</div>
    </div>
  )
}
