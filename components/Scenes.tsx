import type { RoomScene as Scene } from '@/lib/types'

/* Illustrations used until the client sends real photos. Pure SVG, no network requests. */

const houses: [number, number, number][] = [
  [120, 352, 1], [158, 344, 0.9], [196, 356, 1], [236, 340, 0.85], [276, 352, 1], [318, 338, 0.9],
  [92, 384, 1.1], [140, 390, 1], [190, 392, 1.1], [242, 382, 1], [294, 388, 1.05], [346, 376, 1],
  [398, 366, 0.9], [440, 356, 0.85], [486, 362, 0.9], [528, 350, 0.8], [574, 358, 0.85], [618, 346, 0.8],
  [392, 398, 1.05], [446, 392, 1], [500, 396, 1.05], [552, 388, 1], [606, 392, 1], [660, 380, 0.9],
  [704, 372, 0.85], [262, 316, 0.75], [212, 322, 0.75], [470, 330, 0.75], [520, 322, 0.7], [660, 340, 0.75],
]

export function HeroScene({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 800 560" role="img" aria-label={label} className="block h-auto w-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d8ec" />
          <stop offset="1" stopColor="#f7eee0" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a7fa3" />
          <stop offset="1" stopColor="#0b4f6c" />
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#sky)" />
      <circle cx="640" cy="118" r="44" fill="#ffd58a" />
      <path d="M0 250 120 170 230 220 340 130 470 210 590 150 700 200 800 160V420H0Z" fill="#7d9c93" opacity=".7" />
      <path d="M0 300 140 230 260 280 380 210 520 270 640 220 800 260V430H0Z" fill="#40704f" />
      <path d="M0 330c90-30 180-22 270-6s200 4 300-14 160-6 230 10v120H0Z" fill="#2f5b3d" />
      <g stroke="#5f8d5a" strokeWidth="3" fill="none" opacity=".6">
        <path d="M40 300c80-20 160-14 240 0" />
        <path d="M420 270c70-14 150-12 220 4" />
        <path d="M520 240c50-10 100-8 150 4" />
      </g>
      <g>
        {houses.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-14" y="-12" width="28" height="18" fill="#fbf8f2" />
            <path d="M-17-12 0-24 17-12Z" fill="#b94a2c" />
            <rect x="-4" y="-6" width="6" height="7" fill="#33606f" />
          </g>
        ))}
      </g>
      <path d="M40 470 330 250" stroke="#26343a" strokeWidth="1.5" />
      <g transform="translate(186 358)">
        <path d="M0-12v8" stroke="#26343a" strokeWidth="1.5" />
        <rect x="-9" y="-4" width="18" height="13" rx="3" fill="#a3144a" />
        <rect x="-6" y="-1" width="12" height="5" rx="1" fill="#f7eee0" />
      </g>
      <rect y="420" width="800" height="140" fill="url(#sea)" />
      <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".45">
        <path d="M80 455h60M260 480h90M470 452h70M620 488h80M360 520h60M120 520h50" />
      </g>
      <path d="M560 440h120l-14 14H574Z" fill="#fbf8f2" />
      <path d="M612 440v-34l26 30Z" fill="#fbf8f2" />
      <g>
        <path d="M0 560V470c30-20 70-26 110-10 30 14 40 44 30 100Z" fill="#2f5b3d" />
        {[
          [24, 486, 16], [56, 474, 18], [92, 482, 15], [40, 512, 17], [78, 508, 16], [110, 520, 13], [18, 536, 14], [60, 540, 15],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#c2185b' : '#a3144a'} opacity=".95" />
        ))}
      </g>
    </svg>
  )
}

function WindowView({ view }: { view: Scene['view'] }) {
  if (view === 'garden') {
    return (
      <>
        <rect width="120" height="110" fill="#bfe0d0" />
        <circle cx="30" cy="70" r="34" fill="#4f8a4a" />
        <circle cx="90" cy="60" r="38" fill="#3d6b35" />
        <circle cx="64" cy="96" r="26" fill="#c2185b" />
      </>
    )
  }
  if (view === 'city') {
    return (
      <>
        <rect width="120" height="110" fill="#a9d8ec" />
        <rect y="64" width="120" height="46" fill="#2a7fa3" />
        {[10, 40, 70, 100].map((x) => (
          <g key={x}>
            <rect x={x - 10} y="58" width="20" height="16" fill="#fbf8f2" />
            <path d={`M${x - 12} 58 ${x} 48 ${x + 12} 58Z`} fill="#b94a2c" />
          </g>
        ))}
      </>
    )
  }
  return (
    <>
      <rect width="120" height="110" fill="#a9d8ec" />
      <circle cx="92" cy="28" r="12" fill="#ffd58a" />
      <rect y="62" width="120" height="48" fill="#2a7fa3" />
      <path d="M14 80h24M60 94h30" stroke="#fff" strokeWidth="2" opacity=".5" />
    </>
  )
}

export function RoomIllustration({ scene, label }: { scene: Scene; label: string }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="260" fill={scene.wall} />
      <rect y="210" width="400" height="50" fill="#c9a27e" />
      <path d="M0 214h400" stroke="#b08763" strokeWidth="2" />
      <g transform="translate(246 36)">
        <rect x="-8" y="-8" width="136" height="126" rx="4" fill="#fbf8f2" />
        <svg width="120" height="110" viewBox="0 0 120 110">
          <WindowView view={scene.view} />
        </svg>
        <path d="M60 0v110M0 55h120" stroke="#fbf8f2" strokeWidth="5" />
      </g>
      <rect x="40" y="110" width="170" height="44" rx="8" fill={scene.accent} />
      <rect x="30" y="150" width="190" height="52" rx="6" fill={scene.linen} />
      <rect x="30" y="172" width="190" height="30" rx="4" fill={scene.accent} opacity=".25" />
      <rect x="52" y="136" width="58" height="22" rx="10" fill="#ffffff" stroke="#e5ddd0" />
      <rect x="128" y="136" width="58" height="22" rx="10" fill="#ffffff" stroke="#e5ddd0" />
      <rect x="34" y="200" width="8" height="14" fill="#8a6a4d" />
      <rect x="208" y="200" width="8" height="14" fill="#8a6a4d" />
      <g transform="translate(350 170)">
        <path d="M-14 40h28l-4-26h-20Z" fill="#b94a2c" />
        <path d="M0 14c-2-20-18-30-26-34 10 0 22 10 26 20 2-14 14-26 24-28-6 10-14 24-24 42Z" fill="#3d6b35" />
      </g>
    </svg>
  )
}

export function MapScene({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="400" height="260" fill="#eef0e6" />
      <path d="M0 190c60-10 110 4 170-6s120-24 230-6v82H0Z" fill="#9fd0e4" />
      <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M20 170c80-14 180-26 360-24" />
        <path d="M150 40v140M250 30l-30 150M60 90c90 10 200 6 320-10" />
      </g>
      <g stroke="#d9d6c8" strokeWidth="3" fill="none">
        <path d="M90 50l20 110M300 60l-10 100M180 120h120" />
      </g>
      <path d="M150 40 300 10" stroke="#26343a" strokeDasharray="4 4" strokeWidth="1.5" />
      {[
        [140, 154, '1'],
        [236, 118, '2'],
        [70, 172, '3'],
      ].map(([x, y, n]) => (
        <g key={n as string} transform={`translate(${x} ${y})`}>
          <circle r="11" fill="#0b4f6c" />
          <text y="4" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
            {n}
          </text>
        </g>
      ))}
      <g transform="translate(196 140)">
        <path d="M0 0c-12-14-16-20-16-28a16 16 0 0 1 32 0c0 8-4 14-16 28Z" fill="#a3144a" />
        <circle cy="-28" r="6" fill="#fff" />
      </g>
    </svg>
  )
}
