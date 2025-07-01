import type { Metadata } from 'next'
import '../src/index.css'

import { Outfit } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Concert Search',
  description: 'Concert Search',
}

const outfit = Outfit({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.className}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
