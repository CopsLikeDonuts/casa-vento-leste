'use client'

import { useRef } from 'react'
import { site } from '@/site.config'
import { dictionaries } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { WhatsAppIcon } from './Icons'

// Sits on the green contact band, so it is the light button there.
const cls =
  'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-6 font-bold text-brand-dark transition-colors hover:bg-white/90'

export function WhatsAppButton({ locale }: { locale: Locale }) {
  const t = dictionaries[locale]
  const dialogRef = useRef<HTMLDialogElement>(null)
  const number = site.contact.whatsapp.replace(/\D/g, '')

  if (number) {
    const text = encodeURIComponent(`${site.name}: `)
    return (
      <a className={cls} href={`https://wa.me/${number}?text=${text}`} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon /> {t.whatsapp}
      </a>
    )
  }

  // Demo mode: explain what the button does instead of opening a chat with a made-up number.
  return (
    <>
      <button type="button" className={cls} onClick={() => dialogRef.current?.showModal()}>
        <WhatsAppIcon /> {t.whatsapp}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="wa-title"
        className="m-auto max-w-sm rounded-2xl p-6 text-ink backdrop:bg-ink/50"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <h2 id="wa-title" className="font-display text-xl">
          {t.whatsappDemoTitle}
        </h2>
        <p className="mt-2 text-sm">{t.whatsappDemoText}</p>
        <form method="dialog" className="mt-5">
          <button className="h-11 rounded-full bg-brand px-5 font-bold text-white">{t.close}</button>
        </form>
      </dialog>
    </>
  )
}
