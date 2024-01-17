import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import Link from 'next/link';

import './globals.css';
import TanstackProvider from '@/providers/TanstackProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Platform untuk bertanya apa saja berkaitan koding',
  title: 'Tanya Koding',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ms">
      <body className={inter.className}>
        <TanstackProvider>{children}</TanstackProvider>
        <footer className="bg-footer px-6 py-4 text-center">
          © {currentYear}, Dikuasaikan oleh{' '}
          <Link className="font-bold" href="https://www.primaxoft.com/" rel="noopener noreferrer" target="_blank">
            Primaxoft
          </Link>
        </footer>
      </body>
    </html>
  );
}
