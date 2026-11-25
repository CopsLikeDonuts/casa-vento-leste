/** Dates are plain "YYYY-MM-DD" strings. Math runs in UTC so DST never shifts a day. */
export type ISODate = string

const DAY = 86_400_000

export function toISO(d: Date): ISODate {
  return d.toISOString().slice(0, 10)
}

export function parseISO(s: ISODate): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Today in the visitor's own time zone, as an ISO date. */
export function todayISO(): ISODate {
  const now = new Date()
  return toISO(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

export function addDays(s: ISODate, n: number): ISODate {
  return toISO(new Date(parseISO(s).getTime() + n * DAY))
}

export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / DAY)
}

export function monthStart(s: ISODate): ISODate {
  return s.slice(0, 8) + '01'
}

export function addMonths(s: ISODate, n: number): ISODate {
  const d = parseISO(monthStart(s))
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)))
}

export function daysInMonth(s: ISODate): number {
  const d = parseISO(s)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
}

/** Weeks of a month, Monday first. Empty cells are null. */
export function monthWeeks(month: ISODate): (ISODate | null)[][] {
  const first = monthStart(month)
  const lead = (parseISO(first).getUTCDay() + 6) % 7
  const cells: (ISODate | null)[] = Array(lead).fill(null)
  for (let i = 0; i < daysInMonth(first); i++) cells.push(addDays(first, i))
  while (cells.length % 7) cells.push(null)
  const weeks: (ISODate | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function eachNight(from: ISODate, to: ISODate): ISODate[] {
  const out: ISODate[] = []
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d)
  return out
}
