import type { Metadata } from 'next'
import { Montserrat, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import ThemeProvider from '@/components/providers/ThemeProvider'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const outfit = Outfit({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-outfit'
})

export const metadata: Metadata = {
  title: 'Arabe Pas A Pas',
  description: 'Plateforme d\'apprentissage de la langue arabe avec des leçons interactives et des exercices pratiques',
  keywords: 'arabe, apprentissage, langue arabe, leçons, exercices',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${outfit.variable} font-sans antialiased text-night-900 dark:text-night-50`}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
