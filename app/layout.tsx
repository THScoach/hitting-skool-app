import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HITS Tempo Calculator',
  description: 'Calculate your baseball swing tempo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
