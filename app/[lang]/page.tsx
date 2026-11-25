import type { Locale } from '@/lib/types'
import { Booking, DemoBanner, Faq, Footer, Header, Hero, Nearby, Perks, Rooms, StickyCta } from '@/components/Sections'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale
  return (
    <>
      <DemoBanner locale={locale} />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <Rooms locale={locale} />
        <Perks locale={locale} />
        <Booking locale={locale} />
        <Nearby locale={locale} />
        <Faq locale={locale} />
      </main>
      <Footer locale={locale} />
      <StickyCta locale={locale} />
    </>
  )
}
