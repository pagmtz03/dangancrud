// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Danganronpa V3 Character Manager',
  description: 'Comprehensive CRUD application for managing Danganronpa V3 characters using Next.js and Prisma',
  keywords: 'Danganronpa, character manager, CRUD, Next.js, Prisma',
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1e1b4b" />
      </head>
      <body className="h-full antialiased">
        <div id="root" className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
