'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { site } from '@/site.config'
import { bedText, dictionaries, formatEuro, intlLocale } from '@/lib/i18n'
import type { Locale, Room } from '@/lib/types'
import { bookedNights } from '@/lib/availability'
import {
  addDays,
  addMonths,
  diffDays,
  eachNight,
  monthStart,
  monthWeeks,
  parseISO,
  todayISO,
  type ISODate,
} from '@/lib/dates'
import { CheckIcon, ChevronLeft, ChevronRight } from './Icons'

type Details = { name: string; email: string; phone: string; arrival: string; transfer: boolean; message: string }
const emptyDetails: Details = { name: '', email: '', phone: '', arrival: '', transfer: false, message: '' }
type DayStatus = 'past' | 'free' | 'booked' | 'short' | 'blocked'

const MAX_NIGHTS = 30
const MAX_MONTHS_AHEAD = 11
const ARRIVAL_SLOTS = ['15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00']

export function BookingFlow({ locale }: { locale: Locale }) {
  const d = dictionaries[locale]
  const t = d.booking
  const { minNights, maxGuests, otaName } = site.booking

  const [today, setToday] = useState<ISODate | null>(null)
  const [step, setStep] = useState(0)
  const [guests, setGuests] = useState(2)
  const [checkIn, setCheckIn] = useState<ISODate | null>(null)
  const [checkOut, setCheckOut] = useState<ISODate | null>(null)
  const [preferredRoom, setPreferredRoom] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [details, setDetails] = useState<Details>(emptyDetails)
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email', string>>>({})
  const [hint, setHint] = useState('')
  const [reference, setReference] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const stepChanged = useRef(false)

  // The calendar depends on today's date, so it renders only in the browser.
  useEffect(() => setToday(todayISO()), [])

  useEffect(() => {
    const onChoose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const room = site.rooms.find((r) => r.id === id)
      if (!room) return
      setPreferredRoom(id)
      setGuests((g) => Math.min(g, room.guests))
      setCheckIn(null)
      setCheckOut(null)
      setRoomId(null)
      setStep(0)
    }
    window.addEventListener('choose-room', onChoose)
    return () => window.removeEventListener('choose-room', onChoose)
  }, [])

  useEffect(() => {
    if (!stepChanged.current) return
    stepChanged.current = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rootRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const goTo = (n: number) => {
    stepChanged.current = true
    setStep(n)
  }

  const booked = useMemo(() => new Map(site.rooms.map((r) => [r.id, bookedNights(r.id)])), [])
  const calendarRooms = useMemo(() => {
    const pref = site.rooms.find((r) => r.id === preferredRoom)
    return pref ? [pref] : site.rooms.filter((r) => r.guests >= guests)
  }, [preferredRoom, guests])

  const roomFree = (r: Room, from: ISODate, to: ISODate) => eachNight(from, to).every((n) => !booked.get(r.id)!.has(n))
  // A day can start a stay only if some room is free for at least the minimum stay.
  const canStartStay = (day: ISODate) => calendarRooms.some((r) => roomFree(r, day, addDays(day, minNights)))
  const canCheckOut = (from: ISODate, to: ISODate) => {
    const n = diffDays(from, to)
    return n >= minNights && n <= MAX_NIGHTS && calendarRooms.some((r) => roomFree(r, from, to))
  }

  const statusOf = (day: ISODate): DayStatus => {
    if (!today || day < today) return 'past'
    if (checkIn && !checkOut && day > checkIn) {
      if (diffDays(checkIn, day) < minNights) return 'short'
      return canCheckOut(checkIn, day) ? 'free' : 'blocked'
    }
    return canStartStay(day) ? 'free' : 'booked'
  }

  const selectDay = (day: ISODate) => {
    const s = statusOf(day)
    if (s === 'past') return
    setHint('')
    const startNew = () => {
      if (!canStartStay(day)) return
      setCheckIn(day)
      setCheckOut(null)
    }
    if (!checkIn || checkOut || day <= checkIn) return startNew()
    if (s === 'short') return setHint(t.minNights(minNights))
    if (s === 'free') return setCheckOut(day)
    startNew()
  }

  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : 0
  const room = site.rooms.find((r) => r.id === roomId) ?? null

  const rangeFmt = useMemo(
    // Long month names: pt-PT renders short months as numbers ("8/12").
    () => new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long', timeZone: 'UTC' }),
    [locale],
  )
  const rangeText =
    checkIn && checkOut ? `${rangeFmt.format(parseISO(checkIn))} – ${rangeFmt.format(parseISO(checkOut))}` : ''

  const toRooms = () => {
    if (!checkIn || !checkOut) return
    const candidates = site.rooms.filter((r) => r.guests >= guests && roomFree(r, checkIn, checkOut))
    const keep = candidates.find((r) => r.id === (roomId ?? preferredRoom))
    setRoomId(keep ? keep.id : candidates.length === 1 ? candidates[0].id : null)
    goTo(1)
  }

  const submitDetails = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!details.name.trim()) next.name = t.required
    if (!details.email.trim()) next.email = t.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) next.email = t.invalidEmail
    setErrors(next)
    const first = (Object.keys(next) as (keyof typeof next)[])[0]
    if (first) {
      document.getElementById(`bk-${first}`)?.focus()
      return
    }
    goTo(3)
  }

  const confirm = () => {
    setReference('DEMO-' + Math.random().toString(36).slice(2, 6).toUpperCase())
    goTo(4)
  }

  const reset = () => {
    setCheckIn(null)
    setCheckOut(null)
    setRoomId(null)
    setPreferredRoom(null)
    setDetails(emptyDetails)
    setErrors({})
    goTo(0)
  }

  const eur = (n: number) => formatEuro(locale, n)
  const stepTitle = step < 4 ? t.steps[step] : t.confirmedTitle

  return (
    <div ref={rootRef} className="scroll-mt-20">
      {step < 4 && (
        <ol className="mb-6 grid grid-cols-4 gap-2" aria-label={t.stepOf(step + 1, 4)}>
          {t.steps.map((label, i) => (
            <li key={label} aria-current={i === step ? 'step' : undefined} className="flex flex-col gap-1.5">
              <span className={`h-1.5 rounded-full ${i <= step ? 'bg-brand' : 'bg-ink/15'}`} />
              <span className={`text-xs ${i === step ? 'font-semibold text-ink' : 'text-ink/70'}`}>{label}</span>
            </li>
          ))}
        </ol>
      )}

      <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-ink outline-none">
        {step < 4 && <span className="sr-only">{t.stepOf(step + 1, 4)}: </span>}
        {stepTitle}
      </h3>

      {step === 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              {t.guests}
              <select
                className="h-12 rounded-xl border border-ink/25 bg-white px-3.5 text-base"
                value={guests}
                onChange={(e) => {
                  setGuests(Number(e.target.value))
                  setPreferredRoom(null)
                  setCheckIn(null)
                  setCheckOut(null)
                }}
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            {preferredRoom && (
              <p className="flex items-center gap-3 rounded-full bg-brand/10 px-4 py-2 text-sm text-ink">
                {t.availabilityFor(site.rooms.find((r) => r.id === preferredRoom)!.name[locale])}
                <button type="button" className="font-semibold text-brand underline" onClick={() => setPreferredRoom(null)}>
                  {t.showAllRooms}
                </button>
              </p>
            )}
          </div>

          <div className="mt-5 min-h-[23rem]">
            {today ? (
              <Calendar
                locale={locale}
                today={today}
                checkIn={checkIn}
                checkOut={checkOut}
                statusOf={statusOf}
                onSelect={selectDay}
              />
            ) : (
              <p className="py-16 text-center text-ink/70">{t.loadingCalendar}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/75" aria-hidden="true">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded border border-ink/20 bg-white" />{t.legendFree}</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-ink/10" />{t.legendBooked}</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-brand" />{t.legendSelected}</span>
          </div>

          <p className="mt-4 min-h-6 text-sm text-ink" aria-live="polite">
            {hint ||
              (!checkIn
                ? t.pickCheckIn
                : !checkOut
                  ? `${t.pickCheckOut} ${t.minNights(minNights)}`
                  : `${t.nights(nights)}, ${rangeText}`)}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton onClick={toRooms} disabled={!checkIn || !checkOut}>
              {t.next}
            </PrimaryButton>
            {checkIn && (
              <SecondaryButton
                onClick={() => {
                  setCheckIn(null)
                  setCheckOut(null)
                  setHint('')
                }}
              >
                {t.clearDates}
              </SecondaryButton>
            )}
          </div>
        </div>
      )}

      {step === 1 && checkIn && checkOut && (
        <div className="mt-4">
          <p className="text-sm text-ink/80">
            {t.nights(nights)}, {rangeText}, {t.guestCount(guests)}
          </p>
          <fieldset className="mt-4 grid gap-3">
            <legend className="sr-only">{t.steps[1]}</legend>
            {site.rooms.map((r) => {
              const tooSmall = r.guests < guests
              const free = roomFree(r, checkIn, checkOut)
              const disabled = tooSmall || !free
              const selected = roomId === r.id
              return (
                <label
                  key={r.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    disabled
                      ? 'cursor-not-allowed border-ink/10 bg-ink/[0.03] text-ink/55'
                      : selected
                        ? 'border-brand bg-brand/5 ring-2 ring-brand'
                        : 'border-ink/20 bg-white hover:border-brand'
                  }`}
                >
                  <input
                    type="radio"
                    name="room"
                    value={r.id}
                    checked={selected}
                    disabled={disabled}
                    onChange={() => setRoomId(r.id)}
                    className="mt-1 size-5 accent-[var(--brand)]"
                  />
                  <span aria-hidden="true" className="door-arch mt-0.5 h-8 w-6 shrink-0" style={{ background: r.door }} />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold">{r.name[locale]}</span>
                      {!disabled && (
                        <span className="ml-auto text-right">
                          <span className="block font-semibold text-ink">{eur(r.priceDirect * nights)}</span>
                          <span className="block text-xs text-ink/70">
                            <s>{eur(r.priceOta * nights)}</s> {otaName}
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm">
                      {r.sizeM2} m², {bedText(r.bed[locale], locale)}, {d.guestsUpTo(r.guests)}
                    </span>
                    {disabled && (
                      <span className="mt-1 block text-sm font-medium">
                        {tooSmall ? t.roomTooSmall(r.guests) : t.roomUnavailable}
                      </span>
                    )}
                  </span>
                </label>
              )
            })}
          </fieldset>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton onClick={() => goTo(2)} disabled={!roomId}>
              {t.next}
            </PrimaryButton>
            <SecondaryButton onClick={() => goTo(0)}>{t.back}</SecondaryButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <form className="mt-4 grid gap-4" noValidate onSubmit={submitDetails}>
          <Field id="bk-name" label={t.name} error={errors.name}>
            <input
              id="bk-name"
              autoComplete="name"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'bk-name-err' : undefined}
              className={inputCls}
            />
          </Field>
          <Field id="bk-email" label={t.email} error={errors.email}>
            <input
              id="bk-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'bk-email-err' : undefined}
              className={inputCls}
            />
          </Field>
          <Field id="bk-phone" label={t.phone}>
            <input
              id="bk-phone"
              type="tel"
              autoComplete="tel"
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field id="bk-arrival" label={t.arrival}>
            <select
              id="bk-arrival"
              value={details.arrival}
              onChange={(e) => setDetails({ ...details, arrival: e.target.value })}
              className={inputCls}
            >
              <option value="">{t.arrivalUnknown}</option>
              {ARRIVAL_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={details.transfer}
              onChange={(e) => setDetails({ ...details, transfer: e.target.checked })}
              className="size-5 accent-[var(--brand)]"
            />
            {t.transfer}
          </label>
          <Field id="bk-msg" label={t.message}>
            <textarea
              id="bk-msg"
              rows={3}
              value={details.message}
              onChange={(e) => setDetails({ ...details, message: e.target.value })}
              className={`${inputCls} h-auto py-2`}
            />
          </Field>
          <div className="mt-2 flex flex-wrap gap-3">
            <PrimaryButton type="submit">{t.next}</PrimaryButton>
            <SecondaryButton onClick={() => goTo(1)}>{t.back}</SecondaryButton>
          </div>
        </form>
      )}

      {step === 3 && room && checkIn && checkOut && (
        <div className="mt-4">
          <dl className="divide-y divide-ink/10 rounded-xl border border-ink/15 bg-white">
            <Row label={t.room} value={room.name[locale]} />
            <Row label={t.dates} value={`${rangeText}, ${t.nights(nights)}`} />
            <Row label={t.guests} value={String(guests)} />
            <Row label={t.name} value={details.name} />
            <Row label={t.email} value={details.email} />
            <Row label={t.otaPriceLabel(otaName)} value={eur(room.priceOta * nights)} muted />
            <Row label={t.directPrice} value={eur(room.priceDirect * nights)} strong />
          </dl>
          <p className="mt-4 rounded-2xl bg-savings px-4 py-3.5 text-base font-bold text-ink">
            {t.saveLine(
              eur((room.priceOta - room.priceDirect) * nights),
              eur(room.priceDirect * nights),
              eur(room.priceOta * nights),
              otaName,
            )}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-ink/80">
            <li>{t.payment}</li>
            <li>{t.touristTax}</li>
            {site.demo && <li className="font-medium text-ink">{t.demoNoCharge}</li>}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton onClick={confirm}>{t.confirm}</PrimaryButton>
            <SecondaryButton onClick={() => goTo(2)}>{t.back}</SecondaryButton>
          </div>
        </div>
      )}

      {step === 4 && room && (
        <div className="mt-4">
          <p className="flex items-start gap-3 text-ink">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white">
              <CheckIcon size={18} />
            </span>
            <span>{t.confirmedText(details.name.trim().split(/\s+/)[0] ?? '')}</span>
          </p>
          <p className="mt-3 text-sm text-ink/80">
            {t.reference}: <span className="font-semibold text-ink">{reference}</span>. {room.name[locale]}, {rangeText}.
          </p>
          <p className="mt-1 text-sm text-ink/80">{t.nothingSent}</p>
          <div className="mt-6 rounded-2xl border-2 border-savings bg-white p-4">
            <p className="font-semibold text-ink">{t.ownerTitle}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink">
              {t.ownerPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <SecondaryButton onClick={reset}>{t.newBooking}</SecondaryButton>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = 'h-12 w-full rounded-xl border border-ink/25 bg-white px-3.5 text-base text-ink'

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-sm font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  )
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-ink/75">{label}</dt>
      <dd className={`text-right ${strong ? 'text-base font-bold text-ink' : muted ? 'text-ink/75 line-through' : 'text-ink'}`}>
        {value}
      </dd>
    </div>
  )
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="h-12 rounded-full bg-brand px-7 font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/25"
    />
  )
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="h-12 rounded-full border-2 border-ink/20 bg-white px-6 font-bold text-ink transition-colors hover:border-ink/50"
    />
  )
}

function Calendar({
  locale,
  today,
  checkIn,
  checkOut,
  statusOf,
  onSelect,
}: {
  locale: Locale
  today: ISODate
  checkIn: ISODate | null
  checkOut: ISODate | null
  statusOf: (d: ISODate) => DayStatus
  onSelect: (d: ISODate) => void
}) {
  const t = dictionaries[locale].booking
  const [offset, setOffset] = useState(0)
  const [months, setMonths] = useState(1)
  const [focusDate, setFocusDate] = useState<ISODate>(checkIn ?? today)
  const moveFocus = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setMonths(mq.matches ? 2 : 1)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const first = addMonths(monthStart(today), offset)
  const visible = Array.from({ length: months }, (_, i) => addMonths(first, i))
  const lastVisibleDay = addDays(addMonths(first, months), -1)
  const tabbable = focusDate >= first && focusDate <= lastVisibleDay ? focusDate : first < today ? today : first

  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus()
  }, [focusDate, offset])

  const fmtMonth = new Intl.DateTimeFormat(intlLocale[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const fmtDay = new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const weekdays = Array.from({ length: 7 }, (_, i) => parseISO(addDays('2024-01-01', i)))
  const fmtWdShort = new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'narrow', timeZone: 'UTC' })
  const fmtWdLong = new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'long', timeZone: 'UTC' })

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (!delta) return
    e.preventDefault()
    const next = addDays(tabbable, delta)
    const maxDay = addDays(addMonths(monthStart(today), MAX_MONTHS_AHEAD + 1), -1)
    if (next < monthStart(today) || next > maxDay) return
    if (next < first) setOffset((o) => o - 1)
    else if (next > lastVisibleDay) setOffset((o) => o + 1)
    moveFocus.current = true
    setFocusDate(next)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-ink/20 bg-white text-ink disabled:opacity-30"
          onClick={() => setOffset((o) => o - 1)}
          disabled={offset === 0}
          aria-label={t.prevMonth}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-ink/20 bg-white text-ink disabled:opacity-30"
          onClick={() => setOffset((o) => o + 1)}
          disabled={offset + months - 1 >= MAX_MONTHS_AHEAD}
          aria-label={t.nextMonth}
        >
          <ChevronRight />
        </button>
      </div>
      <div ref={gridRef} onKeyDown={onKeyDown} className="grid gap-6 md:grid-cols-2">
        {visible.map((month) => (
          <table key={month} role="grid" className="w-full table-fixed border-separate border-spacing-y-1">
            <caption className="mb-2 text-left font-semibold text-ink first-letter:uppercase">{fmtMonth.format(parseISO(month))}</caption>
            <thead>
              <tr>
                {weekdays.map((wd) => (
                  <th key={wd.toISOString()} scope="col" abbr={fmtWdLong.format(wd)} className="pb-1 text-xs font-medium text-muted">
                    {fmtWdShort.format(wd)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthWeeks(month).map((week, wi) => (
                <tr key={wi}>
                  {week.map((day, di) => {
                    if (!day) return <td key={di} />
                    const s = statusOf(day)
                    const isEdge = day === checkIn || day === checkOut
                    const inRange = !!checkIn && !!checkOut && day > checkIn && day < checkOut
                    const unavailable = s === 'past' || s === 'booked' || s === 'blocked'
                    const suffix = s === 'booked' ? `, ${t.dayBooked}` : s === 'past' || s === 'blocked' ? `, ${t.dayUnavailable}` : ''
                    let cls = 'bg-white text-ink hover:bg-brand/10'
                    if (s === 'past') cls = 'text-ink/30'
                    else if (s === 'booked' || s === 'blocked') cls = 'bg-ink/[0.06] text-ink/40 line-through'
                    else if (s === 'short') cls = 'bg-brand/10 text-ink/70'
                    if (inRange) cls = 'bg-brand/15 text-ink'
                    if (isEdge) cls = 'bg-brand text-white font-semibold'
                    return (
                      <td key={day} className="px-0.5">
                        <button
                          type="button"
                          data-date={day}
                          tabIndex={day === tabbable ? 0 : -1}
                          aria-pressed={isEdge}
                          aria-disabled={unavailable || undefined}
                          aria-label={fmtDay.format(parseISO(day)) + suffix}
                          onClick={() => {
                            setFocusDate(day)
                            onSelect(day)
                          }}
                          className={`relative h-10 w-full rounded-lg text-sm tabular-nums transition-colors ${cls} ${
                            unavailable ? 'cursor-not-allowed' : ''
                          }`}
                        >
                          {Number(day.slice(8))}
                          {day === today && !isEdge && (
                            <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-highlight" />
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  )
}
