import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'qijun.io',
  description: 'qijun.io'
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
