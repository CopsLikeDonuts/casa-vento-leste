import { site } from '@/site.config'
import { bedText, dictionaries, formatEuro } from '@/lib/i18n'
import { textOn } from '@/lib/color'
import { locales, type Locale, type Photo } from '@/lib/types'
import { BookingFlow } from './BookingFlow'
import { ChooseRoomButton } from './ChooseRoomButton'
import { WhatsAppButton } from './WhatsAppButton'
import { StickyCta as StickyBar } from './StickyCta'
import { HeroScene, RoomIllustration } from './Scenes'
import { CarIcon, MailIcon, PhoneIcon, PinIcon, perkIcons } from './Icons'

const href = (l: Locale) => `/${l}/`
const container = 'mx-auto w-full max-w-6xl px-4 sm:px-6'
const c = site.colors
/** Colours dark enough for text on white, used for the walking times. */
const textColors = [c.primary, c.highlight, c.focus, c.ink]

function Img({
  photo,
  alt,
  sizes,
  priority,
  className,
}: {
  photo: Photo
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      // Below-the-fold photos must not compete with the hero door for bandwidth.
      fetchPriority={priority ? 'high' : 'low'}
      decoding="async"
      className={className}
    />
  )
}

export function DemoBanner({ locale }: { locale: Locale }) {
  if (!site.demo) return null
  const t = dictionaries[locale]
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs text-white sm:text-sm">
      <strong className="font-semibold">{t.demoBanner}</strong> <span className="text-white/85">{t.demoBannerNote}</span>
    </div>
  )
}

export function Header({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-wall/95 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        <a href={href(locale)} className="font-display text-[22px] leading-none text-ink md:text-[26px]">
          {site.name}
        </a>
        <nav aria-label="Menu" className="hidden items-center gap-7 text-[15px] font-medium text-ink md:flex">
          <a href="#rooms" className="py-2 hover:text-brand">{t.nav.rooms}</a>
          <a href="#location" className="py-2 hover:text-brand">{t.nav.location}</a>
          <a href="#faq" className="py-2 hover:text-brand">{t.nav.faq}</a>
          <a href="#contact" className="py-2 hover:text-brand">{t.nav.contact}</a>
        </nav>
        <div className="flex items-center gap-3">
          <ul className="flex rounded-full border border-ink/15 bg-white p-0.5 text-xs font-bold">
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={href(l)}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === locale ? 'true' : undefined}
                  aria-label={`${l.toUpperCase()}, ${dictionaries[l].langName}`}
                  className={`grid h-9 min-w-10 place-items-center rounded-full px-2 ${
                    l === locale ? 'bg-ink text-white' : 'text-ink hover:text-brand'
                  }`}
                >
                  {l.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#book"
            className="hidden h-11 items-center rounded-full bg-brand px-6 text-[15px] font-bold text-white hover:bg-brand-dark sm:inline-flex"
          >
            {t.nav.book}
          </a>
        </div>
      </div>
    </header>
  )
}

/** The hero: the house door with the photo inside, the headline and the price comparison. */
export function Hero({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const minPrice = Math.min(...site.rooms.map((r) => r.priceDirect))
  return (
    <section className="pb-6 pt-6 md:pb-16 md:pt-10">
      <div className={`${container} grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-14`}>
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink md:text-[52px] lg:text-[64px] lg:leading-[1.02]">
            {site.headline[locale]}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-muted md:mx-0 md:text-lg">{site.intro[locale]}</p>
          <div className="mt-6 flex flex-col items-center gap-3 md:items-start">
            <a
              href="#book"
              className="inline-flex h-14 w-full max-w-xs items-center justify-center rounded-full bg-brand px-8 text-[17px] font-bold text-white hover:bg-brand-dark md:w-auto"
            >
              {t.checkAvailability}
            </a>
            <span className="text-[15px] text-muted">{t.fromPerNight(formatEuro(locale, minPrice))}</span>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-[300px] md:order-2 lg:w-[380px]">
          <div className="door-arch bg-brand p-3.5 pb-0 lg:p-[18px] lg:pb-0">
            <div className="door-arch aspect-[5/7] overflow-hidden bg-white/20">
              {site.hero.image ? (
                <Img
                  photo={site.hero.image}
                  alt={site.hero.imageAlt[locale]}
                  sizes="(min-width: 1024px) 344px, 272px"
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <HeroScene label={site.hero.imageAlt[locale]} />
              )}
            </div>
          </div>
          {site.hero.houseNumber && (
            <span
              aria-hidden="true"
              className="absolute -right-3.5 top-[38%] grid h-12 w-10 place-items-center rounded-md border-2 border-focus bg-white font-display text-2xl text-focus lg:h-[60px] lg:w-[50px] lg:text-3xl"
            >
              {site.hero.houseNumber}
            </span>
          )}
        </div>

        <div className="order-3">
          <Savings locale={locale} />
        </div>
      </div>
    </section>
  )
}

/** One worked example: the first room for three nights, here and on the OTA. */
function Savings({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const b = t.booking
  const room = site.rooms[0]
  const nights = 3
  const ota = room.priceOta * nights
  const direct = room.priceDirect * nights
  const eur = (n: number) => formatEuro(locale, n)
  return (
    <section aria-labelledby="savings-title" className="rounded-[22px] bg-savings p-5 text-ink sm:p-6">
      <h2 id="savings-title" className="font-display text-[26px] leading-[1.1] lg:text-[28px]">
        {t.savingsTitle(site.booking.otaName)}
      </h2>
      <div className="mt-4 rounded-2xl bg-white/80 px-4 py-3.5">
        <p className="text-sm text-muted">
          {room.name[locale]}, {b.nights(nights)}, {b.guestCount(2)}
        </p>
        <p className="mt-1.5 flex justify-between text-muted">
          <span>{site.booking.otaName}</span>
          <s>{eur(ota)}</s>
        </p>
        <p className="mt-1 flex items-baseline justify-between">
          <span className="font-bold">{t.savingsHere}</span>
          <span className="font-display text-[30px] leading-none">{eur(direct)}</span>
        </p>
      </div>
      <p className="mt-3.5 text-[17px] font-bold">{t.savingsLine(eur(ota - direct))}</p>
    </section>
  )
}

export function Rooms({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const eur = (n: number) => formatEuro(locale, n)
  return (
    <section id="rooms" aria-labelledby="rooms-title" className="scroll-mt-20 py-12 md:py-16">
      <div className={container}>
        <h2 id="rooms-title" className="font-display text-[32px] leading-[1.1] text-ink md:text-5xl">
          {t.roomsTitle(site.rooms.length)}
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-muted md:text-base">{t.roomsLead}</p>
      </div>
      <ul className="mx-auto mt-6 flex max-w-6xl snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 sm:scroll-px-6 sm:px-6 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
        {site.rooms.map((r) => (
          <li key={r.id} className="flex w-[230px] shrink-0 snap-start flex-col md:w-auto">
            <div className="door-arch p-2.5 pb-0" style={{ background: r.door }}>
              <div className="door-arch aspect-[5/7] overflow-hidden bg-white/25">
                {r.image ? (
                  <Img
                    photo={r.image}
                    alt={r.imageAlt?.[locale] ?? r.name[locale]}
                    sizes="(min-width: 768px) 25vw, 210px"
                    className="h-full w-full object-cover"
                  />
                ) : r.scene ? (
                  <RoomIllustration scene={r.scene} label={r.name[locale]} />
                ) : null}
              </div>
            </div>
            <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">{r.name[locale]}</h3>
            <p className="mt-1 text-sm text-muted">
              {r.sizeM2} m², {bedText(r.bed[locale], locale)}, {t.guestsUpTo(r.guests)}
            </p>
            <p className="mt-1.5 text-[15px] text-ink">
              <strong className="text-lg">{eur(r.priceDirect)}</strong> {t.perNight}{' '}
              <span className="text-muted">
                (<s>{eur(r.priceOta)}</s> {t.onOta(site.booking.otaName)})
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">{r.description[locale]}</p>
            <div className="mt-auto pt-4">
              <ChooseRoomButton roomId={r.id} label={t.chooseRoom} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Perks({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const doors = site.rooms.map((r) => r.door)
  const breakfast = site.photos?.breakfast
  return (
    <section aria-labelledby="perks-title" className="bg-white py-12 md:py-16">
      <div className={`${container} grid items-center gap-8 md:grid-cols-[1fr_1.15fr] md:gap-12`}>
        {breakfast && (
          <div className="overflow-hidden rounded-[28px]">
            <Img
              photo={breakfast.image}
              alt={breakfast.alt[locale]}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        )}
        <div>
          <h2 id="perks-title" className="font-display text-[32px] leading-[1.1] text-ink md:text-[40px]">
            {t.whyDirect}
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {site.perks.map((p, i) => {
              const Icon = perkIcons[p.icon]
              const bg = doors[i % doors.length]
              return (
                <li key={p.icon} className="flex gap-3">
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-full"
                    style={{ background: bg, color: textOn(bg, c.ink) }}
                  >
                    <Icon />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{p.title[locale]}</span>
                    <span className="block text-[15px] text-muted">{p.text[locale]}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Booking({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].booking
  return (
    <section id="book" aria-labelledby="book-title" className="scroll-mt-16 py-12 md:py-16">
      <div className={container}>
        <div className="mx-auto max-w-3xl">
          <h2 id="book-title" className="font-display text-[32px] leading-[1.1] text-ink md:text-[40px]">
            {t.title}
          </h2>
          <p className="mt-2 text-muted">{t.lead}</p>
          <div className="mt-6 rounded-[22px] bg-white p-4 shadow-[0_1px_0_rgba(35,48,45,0.12)] sm:p-6">
            <BookingFlow locale={locale} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** "On the doorstep": walking times as tiles, then the car trips and a map link. */
export function Nearby({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const { lat, lng } = site.location
  const walk = site.location.nearby.filter((p) => p.mode === 'walk')
  const car = site.location.nearby.filter((p) => p.mode === 'car')
  const sea = site.photos?.sea
  return (
    <section id="location" aria-labelledby="location-title" className="scroll-mt-20 bg-white py-12 md:py-16">
      <div className={container}>
        <h2 id="location-title" className="font-display text-[32px] leading-[1.1] text-ink md:text-[40px]">
          {t.nearbyTitle}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-muted">
          <PinIcon size={18} className="shrink-0 text-highlight" />
          {site.contact.address}
        </p>
        {sea && (
          <div className="mt-6 overflow-hidden rounded-[28px]">
            <Img photo={sea.image} alt={sea.alt[locale]} sizes="(min-width: 1152px) 1104px, 100vw" className="aspect-[16/9] w-full object-cover md:aspect-[21/8]" />
          </div>
        )}
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {walk.map((p, i) => (
            <li key={p.name.en} className="rounded-[18px] bg-wall p-4">
              <p className="font-display text-[30px] leading-none" style={{ color: textColors[i % textColors.length] }}>
                {t.minutes(p.minutes)}
              </p>
              <p className="mt-1.5 text-[15px] text-ink">{p.name[locale]}</p>
            </li>
          ))}
        </ul>
        {car.map((p) => (
          <p key={p.name.en} className="mt-4 flex items-center gap-2 text-[15px] text-muted">
            <CarIcon size={18} className="shrink-0" />
            {p.name[locale]}: {t.car(p.minutes)}
          </p>
        ))}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center rounded-full border-2 border-brand px-6 text-[15px] font-bold text-brand hover:bg-brand hover:text-white"
        >
          {t.openMaps}
        </a>
      </div>
    </section>
  )
}

export function Faq({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-12 md:py-16">
      <div className={container}>
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-title" className="font-display text-[32px] leading-[1.1] text-ink md:text-[40px]">
            {t.faqTitle}
          </h2>
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {site.faq.map((f) => (
              <details key={f.q.en} className="group py-3">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                  {f.q[locale]}
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xl text-brand transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-1 pb-2 leading-relaxed text-ink/85">{f.a[locale]}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Contact and footer in one green band, like the house door. */
export function Footer({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const tel = site.contact.phone.replace(/\s/g, '')
  const pill = 'inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white/50 px-6 font-bold text-white hover:bg-white/10'
  return (
    <footer id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-brand pb-28 pt-12 text-white sm:pb-12">
      <div className={`${container} text-center md:flex md:items-end md:justify-between md:gap-10 md:text-left`}>
        <div>
          <h2 id="contact-title" className="font-display text-[34px] leading-[1.05] md:text-5xl">
            {t.contactTitle}
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-white/90 md:mx-0">{t.contactLead}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center md:mt-0 md:justify-end">
          <WhatsAppButton locale={locale} />
          <a href={`tel:${tel}`} className={pill}>
            <PhoneIcon size={18} /> {t.call}
          </a>
          <a href={`mailto:${site.contact.email}`} className={pill}>
            <MailIcon size={18} /> {site.contact.email}
          </a>
        </div>
      </div>
      <div className={`${container} mt-10 text-center text-sm leading-relaxed text-white/85 md:text-left`}>
        <div className="flex flex-col gap-1 border-t border-white/25 pt-6 md:flex-row md:flex-wrap md:justify-between md:gap-x-8">
          <p>{site.contact.address}</p>
          <p>{t.checkInOut(site.booking.checkIn, site.booking.checkOut)}</p>
          <p>© {site.name}</p>
        </div>
        {site.demo && <p className="mt-2">{t.footerDemo}</p>}
      </div>
    </footer>
  )
}

export function StickyCta({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const minPrice = Math.min(...site.rooms.map((r) => r.priceDirect))
  return <StickyBar priceText={t.fromPerNight(formatEuro(locale, minPrice))} label={t.nav.book} />
}
