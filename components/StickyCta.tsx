'use client'

import { useEffect, useState } from 'react'

/** Thumb-reach booking bar on phones. Hidden while the booking form is on screen. */
export function StickyCta({ priceText, label }: { priceText: string; label: string }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById('book')
    if (!target) return
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: '0px 0px -40% 0px' })
    io.observe(target)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur transition-transform sm:hidden ${
        hidden ? 'translate-y-full' : ''
      }`}
      inert={hidden}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[15px] text-ink">{priceText}</span>
        <a href="#book" className="inline-flex h-12 items-center rounded-full bg-brand px-7 font-bold text-white">
          {label}
        </a>
      </div>
    </div>
  )
}
