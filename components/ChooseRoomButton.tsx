'use client'

/** Jumps to the booking section and preselects the room. Works as a plain anchor without JS. */
export function ChooseRoomButton({ roomId, label }: { roomId: string; label: string }) {
  return (
    <a
      href="#book"
      onClick={() => window.dispatchEvent(new CustomEvent('choose-room', { detail: roomId }))}
      className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand px-5 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
    >
      {label}
    </a>
  )
}
