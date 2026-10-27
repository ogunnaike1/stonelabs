import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stone Labs — Creative Digital Studio',
  description: 'A studio for motion graphics, websites, mobile apps and 3D visualization.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600&f[]=satoshi@400,500,700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
