import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '研(数学)=>习(编程)',
  description: 'study(math) => practice(programming)'
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
