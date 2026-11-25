import type { Photo, SiteConfig } from './lib/types'

/** Each photo lives in /public/photos as name.webp (1600 px), name-800.webp and name-480.webp. */
const photo = (name: string, width: number, height: number): Photo => ({
  src: `/photos/${name}-800.webp`,
  srcSet: `/photos/${name}-480.webp 480w, /photos/${name}-800.webp 800w, /photos/${name}.webp 1600w`,
  width,
  height,
})

/**
 * Everything specific to one guesthouse lives here.
 * For a real client: change this file and drop photos into /public/photos.
 */
export const site: SiteConfig = {
  demo: true,
  name: 'Casa Vento Leste',
  defaultLocale: 'pt',
  colors: {
    primary: '#1E6B5C',
    primaryDark: '#16524A',
    wall: '#F3F5F4',
    ink: '#23302D',
    muted: '#55625F',
    savings: '#D9A13A',
    highlight: '#A33B32',
    focus: '#2D4F8E',
  },
  headline: {
    pt: 'Entre. O mar fica ao fundo da rua.',
    en: 'Come in. The sea is at the end of the street.',
    de: 'Treten Sie ein. Am Ende der Straße liegt das Meer.',
  },
  tagline: {
    pt: 'Uma casa de hóspedes familiar na Zona Velha do Funchal, com vista para o mar.',
    en: 'A family-run guesthouse in Funchal’s Old Town, with a view of the sea.',
    de: 'Ein familiengeführtes Gästehaus in der Altstadt von Funchal, mit Blick aufs Meer.',
  },
  intro: {
    pt: 'Quatro quartos numa casa de 1920 na Rua de Santa Maria, entre as portas pintadas da Zona Velha.',
    en: 'Four rooms in a 1920s house on Rua de Santa Maria, among the painted doors of the Old Town.',
    de: 'Vier Zimmer in einem Haus von 1920 in der Rua de Santa Maria, zwischen den bemalten Türen der Altstadt.',
  },
  hero: {
    image: photo('porta-hero', 1600, 2324),
    imageAlt: {
      pt: 'Uma porta de madeira vermelha, pintada com flores, numa rua da Madeira.',
      en: 'A red wooden door painted with flowers on a street in Madeira.',
      de: 'Eine rote Holztür mit gemalten Blumen in einer Straße auf Madeira.',
    },
    houseNumber: '9',
  },
  photos: {
    breakfast: {
      image: photo('pequeno-almoco', 1600, 1067),
      alt: {
        pt: 'Pequeno-almoço numa mesa vermelha: fruta, ovos e torradas.',
        en: 'Breakfast on a red table: fruit, eggs and toast.',
        de: 'Frühstück auf einem roten Tisch: Obst, Eier und Toast.',
      },
    },
    sea: {
      image: photo('mar-funchal', 1600, 1067),
      alt: {
        pt: 'Telhados de telha e a baía do Funchal ao fundo.',
        en: 'Tiled roofs with the bay of Funchal behind them.',
        de: 'Ziegeldächer und dahinter die Bucht von Funchal.',
      },
    },
  },
  contact: {
    phone: '+351 291 000 000',
    email: 'reservas@exemplo.pt',
    // Empty in the demo: the button explains what it does instead of opening a chat.
    whatsapp: '',
    address: 'Zona Velha, 9060 Funchal',
  },
  location: {
    lat: 32.6487,
    lng: -16.9036,
    area: {
      pt: 'Zona Velha, Funchal',
      en: 'Old Town, Funchal',
      de: 'Altstadt, Funchal',
    },
    nearby: [
      { name: { pt: 'Rua de Santa Maria', en: 'Rua de Santa Maria', de: 'Rua de Santa Maria' }, minutes: 1, mode: 'walk' },
      { name: { pt: 'Teleférico do Monte', en: 'Cable car to Monte', de: 'Seilbahn nach Monte' }, minutes: 3, mode: 'walk' },
      { name: { pt: 'Mercado dos Lavradores', en: 'Farmers’ Market', de: 'Bauernmarkt' }, minutes: 5, mode: 'walk' },
      { name: { pt: 'Praia da Barreirinha', en: 'Barreirinha beach', de: 'Strand Barreirinha' }, minutes: 6, mode: 'walk' },
      { name: { pt: 'Aeroporto da Madeira', en: 'Madeira Airport', de: 'Flughafen Madeira' }, minutes: 20, mode: 'car' },
    ],
  },
  booking: {
    otaName: 'Booking.com',
    minNights: 2,
    maxGuests: 3,
    checkIn: '15:00',
    checkOut: '11:00',
  },
  rooms: [
    {
      id: 'mar',
      name: { pt: 'Quarto Mar', en: 'Sea Room', de: 'Meerzimmer' },
      description: {
        pt: 'Janelas grandes viradas para a baía. Acorda com o som do mar.',
        en: 'Big windows facing the bay. Wake up to the sound of the sea.',
        de: 'Große Fenster zur Bucht. Aufwachen mit dem Rauschen des Meeres.',
      },
      bed: { pt: 'Cama de casal', en: 'Double bed', de: 'Doppelbett' },
      guests: 2,
      sizeM2: 18,
      priceDirect: 82,
      priceOta: 95,
      door: '#1E6B5C',
      image: photo('quarto-mar', 1600, 1200),
      imageAlt: {
        pt: 'Quarto com cama de casal e porta envidraçada para o mar.',
        en: 'A room with a double bed and a glass door onto the sea.',
        de: 'Zimmer mit Doppelbett und Glastür zum Meer.',
      },
      amenities: [
        { pt: 'Vista mar', en: 'Sea view', de: 'Meerblick' },
        { pt: 'Ar condicionado', en: 'Air conditioning', de: 'Klimaanlage' },
      ],
    },
    {
      id: 'varanda',
      name: { pt: 'Quarto Varanda', en: 'Balcony Room', de: 'Balkonzimmer' },
      description: {
        pt: 'Portas abertas para uma varanda sobre os telhados da Zona Velha.',
        en: 'French doors onto a balcony over the rooftops of the Old Town.',
        de: 'Flügeltüren zu einem Balkon über den Dächern der Altstadt.',
      },
      bed: { pt: 'Cama de casal', en: 'Double bed', de: 'Doppelbett' },
      guests: 2,
      sizeM2: 16,
      priceDirect: 76,
      priceOta: 88,
      door: '#A33B32',
      image: photo('quarto-varanda', 1600, 934),
      imageAlt: {
        pt: 'Portas de varanda abertas com vista para telhados e mar.',
        en: 'Open balcony doors with a view of rooftops and the sea.',
        de: 'Offene Balkontüren mit Blick auf Dächer und Meer.',
      },
      amenities: [
        { pt: 'Varanda', en: 'Balcony', de: 'Balkon' },
        { pt: 'Ventoinha de teto', en: 'Ceiling fan', de: 'Deckenventilator' },
      ],
    },
    {
      id: 'patio',
      name: { pt: 'Quarto Pátio', en: 'Patio Room', de: 'Patiozimmer' },
      description: {
        pt: 'Duas camas, sossegado, com saída para o pátio do pequeno-almoço.',
        en: 'Two beds, quiet, with a door onto the breakfast patio.',
        de: 'Zwei Betten, ruhig, mit Tür zum Frühstückspatio.',
      },
      bed: { pt: 'Duas camas individuais', en: 'Two single beds', de: 'Zwei Einzelbetten' },
      guests: 2,
      sizeM2: 14,
      priceDirect: 68,
      priceOta: 79,
      door: '#2D4F8E',
      image: photo('quarto-patio', 1600, 1067),
      imageAlt: {
        pt: 'Quarto claro com duas camas individuais.',
        en: 'A bright room with two single beds.',
        de: 'Helles Zimmer mit zwei Einzelbetten.',
      },
      amenities: [
        { pt: 'Pátio', en: 'Patio', de: 'Patio' },
        { pt: 'Secretária', en: 'Desk', de: 'Schreibtisch' },
      ],
    },
    {
      id: 'suite',
      name: { pt: 'Suite Telhado', en: 'Rooftop Suite', de: 'Dach-Suite' },
      description: {
        pt: 'O quarto maior, com terraço privado e vista até ao mar.',
        en: 'The largest room, with a private terrace and a view to the sea.',
        de: 'Das größte Zimmer, mit privater Terrasse und Blick bis zum Meer.',
      },
      bed: { pt: 'Cama king e sofá-cama', en: 'King bed and sofa bed', de: 'Kingsize-Bett und Schlafsofa' },
      guests: 3,
      sizeM2: 24,
      priceDirect: 112,
      priceOta: 130,
      door: '#D9A13A',
      image: photo('suite-telhado', 1600, 1067),
      imageAlt: {
        pt: 'Cama grande com cabeceira de verga e almofadas cor de laranja.',
        en: 'A large bed with a wicker headboard and orange cushions.',
        de: 'Großes Bett mit Rattan-Kopfteil und orangefarbenen Kissen.',
      },
      amenities: [
        { pt: 'Terraço privado', en: 'Private terrace', de: 'Private Terrasse' },
        { pt: 'Máquina de café', en: 'Coffee machine', de: 'Kaffeemaschine' },
      ],
    },
  ],
  perks: [
    {
      icon: 'tag',
      title: { pt: 'Melhor preço garantido', en: 'Best price, guaranteed', de: 'Bester Preis garantiert' },
      text: {
        pt: 'Aqui paga menos do que nas plataformas de reservas.',
        en: 'You pay less here than on booking platforms.',
        de: 'Hier zahlen Sie weniger als auf Buchungsportalen.',
      },
    },
    {
      icon: 'coffee',
      title: { pt: 'Pequeno-almoço incluído', en: 'Breakfast included', de: 'Frühstück inklusive' },
      text: {
        pt: 'Só nas reservas diretas.',
        en: 'For direct bookings only.',
        de: 'Nur bei Direktbuchung.',
      },
    },
    {
      icon: 'calendar',
      title: { pt: 'Cancelamento flexível', en: 'Flexible cancellation', de: 'Flexible Stornierung' },
      text: {
        pt: 'Grátis até 48 horas antes da chegada.',
        en: 'Free up to 48 hours before arrival.',
        de: 'Kostenlos bis 48 Stunden vor Anreise.',
      },
    },
    {
      icon: 'chat',
      title: { pt: 'Fale connosco', en: 'Talk to us', de: 'Direkter Kontakt' },
      text: {
        pt: 'Respondemos no WhatsApp, em português, inglês e alemão.',
        en: 'We reply on WhatsApp in Portuguese, English and German.',
        de: 'Wir antworten per WhatsApp auf Portugiesisch, Englisch und Deutsch.',
      },
    },
  ],
  faq: [
    {
      q: { pt: 'A que horas é o check-in?', en: 'What time is check-in?', de: 'Wann ist der Check-in?' },
      a: {
        pt: 'O check-in é a partir das 15:00 e o check-out até às 11:00. Se chegar mais cedo, guardamos a bagagem.',
        en: 'Check-in is from 15:00 and check-out is by 11:00. If you arrive early, we keep your luggage.',
        de: 'Check-in ab 15:00 Uhr, Check-out bis 11:00 Uhr. Wenn Sie früher ankommen, bewahren wir Ihr Gepäck auf.',
      },
    },
    {
      q: { pt: 'Organizam transfer do aeroporto?', en: 'Do you arrange an airport transfer?', de: 'Bieten Sie einen Flughafentransfer an?' },
      a: {
        pt: 'Sim. O transfer demora cerca de 20 minutos. Peça-o no formulário de reserva ou no WhatsApp.',
        en: 'Yes. The drive takes about 20 minutes. Ask for it in the booking form or on WhatsApp.',
        de: 'Ja. Die Fahrt dauert etwa 20 Minuten. Fragen Sie im Buchungsformular oder per WhatsApp danach.',
      },
    },
    {
      q: { pt: 'Há estacionamento?', en: 'Is there parking?', de: 'Gibt es Parkplätze?' },
      a: {
        pt: 'Não temos estacionamento próprio. Há um parque público a 3 minutos a pé.',
        en: 'We have no private parking. A public car park is a 3-minute walk away.',
        de: 'Wir haben keine eigenen Parkplätze. Ein öffentliches Parkhaus ist 3 Gehminuten entfernt.',
      },
    },
    {
      q: { pt: 'Como pago a reserva?', en: 'How do I pay?', de: 'Wie bezahle ich?' },
      a: {
        pt: 'Paga 30% ao reservar e o resto na chegada, com cartão ou MB WAY.',
        en: 'You pay 30% when you book and the rest on arrival, by card or MB WAY.',
        de: 'Sie zahlen 30 % bei der Buchung und den Rest bei Ankunft, per Karte oder MB WAY.',
      },
    },
    {
      q: { pt: 'Porque é mais barato reservar aqui?', en: 'Why is it cheaper to book here?', de: 'Warum ist es hier günstiger?' },
      a: {
        pt: 'As plataformas cobram-nos uma comissão por cada reserva. Quando reserva diretamente, passamos essa poupança para si.',
        en: 'Platforms charge us a commission on every booking. When you book direct, we pass that saving on to you.',
        de: 'Buchungsportale berechnen uns für jede Buchung eine Provision. Bei Direktbuchung geben wir diese Ersparnis an Sie weiter.',
      },
    },
  ],
}
