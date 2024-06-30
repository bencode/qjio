import type { Metadata } from 'next'
import './globals.css'

type Props = {
  params: Record<string, string>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = '学(数学)=>习(代码)'
  const description = 'study(math) => practice(code)'
  const keywords = [
    'functional programming',
    'mathematics',
    'combinatorics',
    'programming languages',
  ]
  return {
    title,
    description,
    keywords,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
