"use client"

import { useEffect, useRef } from "react"

// Each word has a "top" (wild/unmowed) and "bottom" (trimmed/mowed) image.
// A clip-path rectangle sweeps left→right then right→left on a loop,
// progressively revealing the bottom layer beneath the top layer.

export function GrassReveal() {
  const perfectlyTopRef = useRef<HTMLDivElement>(null)
  const craftedTopRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Animation config
    const DURATION = 2200   // ms for one full sweep
    const PAUSE    = 900    // ms hold at each end
    const TOTAL    = DURATION + PAUSE

    let startTime: number | null = null

    function animate(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = (ts - startTime) % (TOTAL * 2)

      let pct: number

      if (elapsed < TOTAL) {
        // Phase 1: sweep left → right (reveal bottom)
        const t = Math.min(elapsed / DURATION, 1)
        pct = ease(t) * 100
      } else {
        // Phase 2: sweep right → left (reveal top again)
        const t = Math.min((elapsed - TOTAL) / DURATION, 1)
        pct = (1 - ease(t)) * 100
      }

      const clip = `inset(0 ${100 - pct}% 0 0)`

      if (perfectlyTopRef.current) {
        perfectlyTopRef.current.style.clipPath = clip
      }
      if (craftedTopRef.current) {
        craftedTopRef.current.style.clipPath = clip
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-start gap-1 select-none" aria-label="Perfectly Crafted">

      {/* ── PERFECTLY ── smaller word */}
      <div className="relative" style={{ width: 420, height: 110 }}>
        {/* Bottom layer — mowed/trimmed (always visible) */}
        <img
          src="/images/perfectly_bottom.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain object-left"
          draggable={false}
        />
        {/* Top layer — wild grass (clipped away to reveal bottom) */}
        <div
          ref={perfectlyTopRef}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(0 0% 0 0)" }}
        >
          <img
            src="/images/perfectly_top.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain object-left"
            draggable={false}
          />
        </div>
      </div>

      {/* ── CRAFTED ── larger word */}
      <div className="relative" style={{ width: 580, height: 148 }}>
        {/* Bottom layer */}
        <img
          src="/images/crafted_bottom.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain object-left"
          draggable={false}
        />
        {/* Top layer */}
        <div
          ref={craftedTopRef}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(0 0% 0 0)" }}
        >
          <img
            src="/images/crafted_top.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain object-left"
            draggable={false}
          />
        </div>
      </div>

    </div>
  )
}

// Smooth ease-in-out
function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
