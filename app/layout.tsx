import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kpop Daily - Efemérides del Kpop',
  description: 'Celebrando la historia y cultura del Kpop, un día a la vez',
  generator: 'Next.js + Supabase',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
