import type { Metadata } from 'next';
import './globals.css'

export const metadata: Metadata = {
  title: '学(数学)=>习(代码)',
  description: 'study(math) => practice(code)',
  keywords: ['functional programming', 'mathematics', 'combinatorics', 'programming languages']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
