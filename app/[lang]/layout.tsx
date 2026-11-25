import type { Metadata, Viewport } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Caprasimo, Rethink_Sans } from 'next/font/google'
import { site } from '@/site.config'
import { locales, type Locale } from '@/lib/types'
import '../globals.css'

const caprasimo = Caprasimo({ weight: '400', subsets: ['latin'], variable: '--font-caprasimo', display: 'swap' })
const rethink = Rethink_Sans({ subsets: ['latin'], variable: '--font-rethink', display: 'swap' })

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

const isLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l)

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: `${site.name}, ${site.location.area[lang]}`,
    description: site.tagline[lang],
    // A demo must never compete with real businesses in search.
    robots: site.demo ? { index: false, follow: false } : undefined,
    icons: { icon: '/favicon.svg' },
  }
}

export const viewport: Viewport = { themeColor: site.colors.primary, width: 'device-width', initialScale: 1 }

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const c = site.colors
  const vars = {
    '--brand': c.primary,
    '--brand-dark': c.primaryDark,
    '--wall': c.wall,
    '--ink': c.ink,
    '--muted': c.muted,
    '--savings': c.savings,
    '--highlight': c.highlight,
    '--focus': c.focus,
  } as CSSProperties
  return (
    <html lang={lang} className={`${caprasimo.variable} ${rethink.variable}`} style={vars}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
