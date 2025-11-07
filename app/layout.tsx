import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hits Tempo Analyzer',
  description: 'Analyze hitting tempo with Load, Fire, and Contact timestamps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
