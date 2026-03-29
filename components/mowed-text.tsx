"use client"

import { useEffect, useRef, useState } from "react"

const DURATION = 3200 // ms for one full pass
const PAUSE = 1200    // ms to hold fully-mowed before re-growing

const styles = `
  @keyframes grass-sway {
    0%,100% { transform: skewX(0deg) scaleY(1); }
    25%      { transform: skewX(3deg) scaleY(1.04); }
    75%      { transform: skewX(-3deg) scaleY(1.02); }
  }
  @keyframes grow-in {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }
  .tall-grass-text {
    color: #5ec45e;
    text-shadow:
      0 -6px 0 #4db84d,
      0 -10px 0 #3da83d,
      0 -14px 0 rgba(61,168,61,0.5),
      0 -18px 0 rgba(61,168,61,0.2),
      1px -7px 0 #55c455,
      -1px -8px 0 #48bc48,
      2px -11px 0 #42b042,
      -2px -12px 0 #3aa83a;
    display: inline-block;
    transform-origin: bottom center;
    animation: grass-sway 2.4s ease-in-out infinite;
  }
  .mowed-text {
    color: #2d7a2d;
    text-shadow:
      0 1px 0 #1e5c1e,
      0 2px 2px rgba(0,0,0,0.3);
  }
`

// Minimal lawnmower SVG
function MowerIcon() {
  return (
    <svg
      width="38" height="28"
      viewBox="0 0 38 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <rect x="4" y="10" width="24" height="10" rx="3" fill="#e8e8e8" stroke="#aaa" strokeWidth="1" />
      {/* Handle */}
      <line x1="26" y1="12" x2="36" y2="4" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="4" r="2" fill="#666" />
      {/* Engine bump */}
      <rect x="10" y="6" width="10" height="6" rx="2" fill="#ccc" stroke="#aaa" strokeWidth="1" />
      {/* Exhaust */}
      <rect x="17" y="3" width="3" height="5" rx="1" fill="#aaa" />
      {/* Wheels */}
      <circle cx="9" cy="21" r="5" fill="#444" stroke="#222" strokeWidth="1" />
      <circle cx="9" cy="21" r="2" fill="#888" />
      <circle cx="23" cy="21" r="5" fill="#444" stroke="#222" strokeWidth="1" />
      <circle cx="23" cy="21" r="2" fill="#888" />
      {/* Blade hint under deck */}
      <line x1="5" y1="20" x2="27" y2="20" stroke="#bbb" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  )
}

interface MowedTextProps {
  className?: string
}

export function MowedText({ className = "" }: MowedTextProps) {
  const [progress, setProgress] = useState(0)   // 0–1: mower position
  const [phase, setPhase] = useState<"mowing" | "paused" | "regrowing">("mowing")
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let pauseTimer: ReturnType<typeof setTimeout>

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current

      if (phase === "mowing") {
        const p = Math.min(elapsed / DURATION, 1)
        setProgress(p)
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setPhase("paused")
          pauseTimer = setTimeout(() => {
            setPhase("regrowing")
            startRef.current = null
          }, PAUSE)
        }
      } else if (phase === "regrowing") {
        // instant re-grow: reset back to 0 and restart mowing
        setProgress(0)
        setPhase("mowing")
        startRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(pauseTimer)
    }
  }, [phase])

  // mowedClip reveals from left: inset(0 <right%> 0 0)
  const rightPct = `${(1 - progress) * 100}%`
  const mowedClip = `inset(-20px ${rightPct} -4px 0)`
  const grassClip = `inset(-20px 0 -4px ${progress * 100}%)`

  // Mower sits right at the boundary, offset so it looks like it's cutting
  const mowerLeft = `calc(${progress * 100}% - 19px)`

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`} style={{ lineHeight: "1.15" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Mowed layer — revealed from the left */}
      <span
        className={`mowed-text font-serif font-bold`}
        style={{ clipPath: mowedClip, display: "inline-block" }}
        aria-hidden="true"
      >
        Perfectly Crafted.
      </span>

      {/* Tall grass layer — clipped away from the left */}
      <span
        className="tall-grass-text font-serif font-bold absolute inset-0"
        style={{ clipPath: grassClip }}
        aria-hidden="true"
      >
        Perfectly Crafted.
      </span>

      {/* Mower icon riding the cut line */}
      {phase !== "paused" && (
        <span
          className="absolute pointer-events-none"
          style={{
            left: mowerLeft,
            bottom: "-6px",
            zIndex: 10,
            transition: "left 16ms linear",
          }}
          aria-hidden="true"
        >
          <MowerIcon />
        </span>
      )}

      {/* Accessible label */}
      <span className="sr-only">Perfectly Crafted.</span>
    </span>
  )
}
