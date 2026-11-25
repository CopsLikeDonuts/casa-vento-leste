import { addDays, type ISODate } from './dates'

/**
 * Fake occupancy for the demo. Each room alternates free and booked runs
 * from a fixed start date, so the calendar looks the same on every visit.
 * A real site reads this from the channel manager instead.
 */
const START: ISODate = '2026-01-01'
const SPAN_DAYS = 900

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cache = new Map<string, Set<ISODate>>()

export function bookedNights(roomId: string): Set<ISODate> {
  const hit = cache.get(roomId)
  if (hit) return hit
  const rand = rng(hash(roomId))
  const nights = new Set<ISODate>()
  let day = 0
  while (day < SPAN_DAYS) {
    day += 2 + Math.floor(rand() * 7) // free run: 2–8 nights
    const len = 2 + Math.floor(rand() * 4) // booked run: 2–5 nights
    for (let i = 0; i < len; i++) nights.add(addDays(START, day + i))
    day += len
  }
  cache.set(roomId, nights)
  return nights
}
