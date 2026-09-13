import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookLoop | Borrow. Lend. Read.',
  description:
    'A peer-to-peer book rental marketplace where readers can discover, borrow and lend books.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}