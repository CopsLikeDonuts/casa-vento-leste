/** Picks white text on a colour when it reaches 4.5:1, otherwise the dark ink. */
export function textOn(hex: string, ink: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const lin = (c: number) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
  return 1.05 / (L + 0.05) >= 4.5 ? '#FFFFFF' : ink
}
