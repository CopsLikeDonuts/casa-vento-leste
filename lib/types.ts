export const locales = ['pt', 'en', 'de'] as const
export type Locale = (typeof locales)[number]
export type L10n = Record<Locale, string>

export type RoomScene = {
  wall: string
  linen: string
  accent: string
  view: 'sea' | 'garden' | 'city'
}

/** A photo under /public. `srcSet` lists the sizes the browser can pick from. */
export type Photo = { src: string; srcSet?: string; width: number; height: number }

export type Room = {
  id: string
  name: L10n
  description: L10n
  bed: L10n
  guests: number
  sizeM2: number
  /** Price per night when booked on this site, in euros. */
  priceDirect: number
  /** Price per night on the OTA (Booking.com), in euros. */
  priceOta: number
  /** Colour of the painted door that frames this room's photo. */
  door: string
  image?: Photo
  imageAlt?: L10n
  /** Drawn instead of a photo when `image` is missing. */
  scene?: RoomScene
  amenities: L10n[]
}

export type SiteConfig = {
  demo: boolean
  name: string
  defaultLocale: Locale
  /**
   * The whole palette. primary: buttons and the hero door. wall: page background.
   * savings: the price comparison panel. highlight: the saving badge. focus: keyboard focus ring.
   */
  colors: {
    primary: string
    primaryDark: string
    wall: string
    ink: string
    muted: string
    savings: string
    highlight: string
    focus: string
  }
  headline: L10n
  tagline: L10n
  intro: L10n
  hero: { image?: Photo; imageAlt: L10n; houseNumber?: string }
  /** Optional photos for the perks and the neighbourhood sections. */
  photos?: { breakfast?: { image: Photo; alt: L10n }; sea?: { image: Photo; alt: L10n } }
  contact: { phone: string; email: string; whatsapp: string; address: string }
  location: { lat: number; lng: number; area: L10n; nearby: { name: L10n; minutes: number; mode: 'walk' | 'car' }[] }
  booking: { otaName: string; minNights: number; maxGuests: number; checkIn: string; checkOut: string }
  rooms: Room[]
  perks: { icon: 'tag' | 'coffee' | 'calendar' | 'chat'; title: L10n; text: L10n }[]
  faq: { q: L10n; a: L10n }[]
}
