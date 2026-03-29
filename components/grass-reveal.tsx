"use client"

import { useEffect, useRef } from "react"

// Duration & pause config
const DURATION = 2400
const PAUSE    = 1000
const TOTAL    = DURATION + PAUSE

// Ease in-out
function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

// Build a jagged "left of X" polygon with a rough right edge
function buildJaggedClipPolygon(
  x: number,      // current cut x position in pixels
  w: number,      // total canvas width
  h: number,      // total canvas height
  roughness: number, // amplitude of jaggedness in px
  segments: number,
): Path2D {
  const path = new Path2D()
  path.moveTo(0, 0)
  path.lineTo(x, 0)

  // Jagged right edge — sinusoidal noise going down the height
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const py = t * h
    // layer two frequencies of noise
    const jitter =
      Math.sin(t * 11.3 + 1.2) * roughness * 0.6 +
      Math.sin(t * 23.7 + 0.5) * roughness * 0.4
    path.lineTo(x + jitter, py)
  }

  path.lineTo(0, h)
  path.closePath()
  return path
}

export function GrassReveal() {
  const canvasPRef   = useRef<HTMLCanvasElement>(null)  // Perfectly canvas
  const canvasCRef   = useRef<HTMLCanvasElement>(null)  // Crafted canvas
  const imgPTopRef   = useRef<HTMLImageElement>(null)
  const imgCTopRef   = useRef<HTMLImageElement>(null)
  const imgPBotRef   = useRef<HTMLImageElement>(null)
  const imgCBotRef   = useRef<HTMLImageElement>(null)
  const rafRef       = useRef<number | null>(null)
  const dimensionsRef = useRef({ wP: 420, hP: 110, wC: 580, hC: 148 })

  useEffect(() => {
    const updateDimensions = () => {
      // Get actual image dimensions after they load
      if (imgPBotRef.current?.naturalWidth) {
        dimensionsRef.current.wP = imgPBotRef.current.naturalWidth
        dimensionsRef.current.hP = imgPBotRef.current.naturalHeight
      }
      if (imgCBotRef.current?.naturalWidth) {
        dimensionsRef.current.wC = imgCBotRef.current.naturalWidth
        dimensionsRef.current.hC = imgCBotRef.current.naturalHeight
      }

      // Resize canvases to match
      if (canvasPRef.current) {
        canvasPRef.current.width = dimensionsRef.current.wP
        canvasPRef.current.height = dimensionsRef.current.hP
      }
      if (canvasCRef.current) {
        canvasCRef.current.width = dimensionsRef.current.wC
        canvasCRef.current.height = dimensionsRef.current.hC
      }
    }

    // Load and check dimensions
    imgPBotRef.current?.addEventListener("load", updateDimensions)
    imgCBotRef.current?.addEventListener("load", updateDimensions)
    imgPTopRef.current?.addEventListener("load", updateDimensions)
    imgCTopRef.current?.addEventListener("load", updateDimensions)

    updateDimensions()

    return () => {
      imgPBotRef.current?.removeEventListener("load", updateDimensions)
      imgCBotRef.current?.removeEventListener("load", updateDimensions)
      imgPTopRef.current?.removeEventListener("load", updateDimensions)
      imgCTopRef.current?.removeEventListener("load", updateDimensions)
    }
  }, [])

  useEffect(() => {
    const canvasP = canvasPRef.current
    const canvasC = canvasCRef.current
    if (!canvasP || !canvasC) return

    const ctxP = canvasP.getContext("2d")
    const ctxC = canvasC.getContext("2d")
    if (!ctxP || !ctxC) return

    // Set canvas internal resolution to match exact image dimensions
    const wP = dimensionsRef.current.wP
    const hP = dimensionsRef.current.hP
    const wC = dimensionsRef.current.wC
    const hC = dimensionsRef.current.hC

    canvasP.width = wP
    canvasP.height = hP
    canvasC.width = wC
    canvasC.height = hC

    let startTime: number | null = null

    function drawWord(
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement | null,
      w: number,
      h: number,
      pct: number,
      roughness: number,
    ) {
      ctx.clearRect(0, 0, w, h)
      if (!img || img.naturalWidth === 0) return

      const cutX = pct * w * 0.01

      ctx.save()
      const poly = buildJaggedClipPolygon(cutX, w, h, roughness, 40)
      ctx.clip(poly)
      ctx.drawImage(img, 0, 0, w, h)
      ctx.restore()
    }

    function animate(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = (ts - startTime) % (TOTAL * 2)

      let pct: number

      if (elapsed < TOTAL) {
        const t = Math.min(elapsed / DURATION, 1)
        pct = ease(t) * 100
      } else {
        const t = Math.min((elapsed - TOTAL) / DURATION, 1)
        pct = (1 - ease(t)) * 100
      }

      drawWord(ctxP, imgPTopRef.current, wP, hP, pct, 10)
      drawWord(ctxC, imgCTopRef.current, wC, hC, pct, 13)

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-start select-none" style={{ maxWidth: 380 }} aria-label="Perfectly Crafted">
      {/* ── PERFECTLY ── */}
      <div className="relative w-full" style={{ aspectRatio: "980 / 270" }}>
        <img
          ref={imgPBotRef}
          src="/images/perfectly_bottom.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain object-left pointer-events-none"
          draggable={false}
        />
        <canvas
          ref={canvasPRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        />
        <img
          ref={imgPTopRef}
          src="/images/perfectly_top.webp"
          alt=""
          aria-hidden
          className="hidden"
          draggable={false}
        />
      </div>

      {/* ── CRAFTED ── overlapping Perfectly, enlarged 15% */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "1100 / 300", marginTop: "-10%", marginLeft: "5%", transform: "scale(1.15)", transformOrigin: "top left" }}
      >
        <img
          ref={imgCBotRef}
          src="/images/crafted_bottom.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain object-left pointer-events-none"
          draggable={false}
        />
        <canvas
          ref={canvasCRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        />
        <img
          ref={imgCTopRef}
          src="/images/crafted_top.webp"
          alt=""
          aria-hidden
          className="hidden"
          draggable={false}
        />
      </div>
    </div>
  )
}
