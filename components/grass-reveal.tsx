"use client"

import { useEffect, useRef } from "react"

// Particle: a tiny grass clipping that shoots upward from the cut edge
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number   // 0→1, decreases each frame
  decay: number
  size: number
  color: string
}

const GRASS_COLORS = ["#4a7c2f", "#5a9a38", "#3d6b27", "#6db33f", "#7ec850", "#4e8a35"]

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
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasPRef   = useRef<HTMLCanvasElement>(null)  // Perfectly canvas
  const canvasCRef   = useRef<HTMLCanvasElement>(null)  // Crafted canvas
  const imgPTopRef   = useRef<HTMLImageElement>(null)
  const imgCTopRef   = useRef<HTMLImageElement>(null)
  const imgPBotRef   = useRef<HTMLImageElement>(null)
  const imgCBotRef   = useRef<HTMLImageElement>(null)
  const rafRef       = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const lastPctRef   = useRef<number>(0)
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

    const wP = dimensionsRef.current.wP
    const hP = dimensionsRef.current.hP
    const wC = dimensionsRef.current.wC
    const hC = dimensionsRef.current.hC

    let startTime: number | null = null
    const particles = particlesRef.current

    function spawnParticles(cutXP: number, cutXC: number) {
      const count = 3 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        // Spawn from both images proportionally
        const fromCrafted = Math.random() > 0.4
        const bx  = fromCrafted ? cutXC + 20 : cutXP + 20  // offset to right of cut
        const by  = fromCrafted
          ? hP - 36 + Math.random() * hC          // crafted word sits lower
          : Math.random() * hP
        particles.push({
          x:     bx + (Math.random() - 0.5) * 6,
          y:     by,
          vx:    (Math.random() - 0.3) * 2.5,
          vy:    -(1.5 + Math.random() * 3),
          life:  1,
          decay: 0.03 + Math.random() * 0.04,
          size:  1.5 + Math.random() * 2.5,
          color: GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)],
        })
      }
    }

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

      // Calculate scaling to fit the image into the canvas without stretching
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const scaledW = img.naturalWidth * scale
      const scaledH = img.naturalHeight * scale
      const offsetX = (w - scaledW) / 2
      const offsetY = (h - scaledH) / 2

      const cutX = pct * w * 0.01  // pct is 0-100

      // Clip to jagged polygon and draw image
      ctx.save()
      const poly = buildJaggedClipPolygon(cutX, w, h, roughness, 40)
      ctx.clip(poly)
      ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH)
      ctx.restore()
    }

    function drawParticles(
      ctxP: CanvasRenderingContext2D,
      ctxC: CanvasRenderingContext2D,
      wP: number,
      hP: number,
      wC: number,
    ) {
      const alive: Particle[] = []
      for (const p of particles) {
        p.x   += p.vx
        p.y   += p.vy
        p.vy  += 0.12  // gravity
        p.life -= p.decay

        if (p.life <= 0) continue
        alive.push(p)

        const alpha = p.life
        // Decide which canvas to draw on based on y position
        const onCrafted = p.y > hP - 36
        const ctx = onCrafted ? ctxC : ctxP
        const py  = onCrafted ? p.y - (hP - 36) : p.y

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        // Tiny elongated grass blade shape
        ctx.beginPath()
        ctx.ellipse(p.x, py, p.size * 0.4, p.size, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      particlesRef.current = alive
    }

    function animate(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = (ts - startTime) % (TOTAL * 2)

      let pct: number
      let isMoving = true

      if (elapsed < TOTAL) {
        const t = Math.min(elapsed / DURATION, 1)
        pct = ease(t) * 100
        isMoving = elapsed < DURATION
      } else {
        const t = Math.min((elapsed - TOTAL) / DURATION, 1)
        pct = (1 - ease(t)) * 100
        isMoving = (elapsed - TOTAL) < DURATION
      }

      const cutXP = pct * wP * 0.01
      const cutXC = pct * wC * 0.01

      // Spawn particles only while the cut is actively moving
      if (isMoving && Math.abs(pct - lastPctRef.current) > 0.3) {
        spawnParticles(cutXP, cutXC)
      }
      lastPctRef.current = pct

      // Draw top-layer images with jagged clip
      drawWord(ctxP, imgPTopRef.current, wP, hP, pct, 10)
      drawWord(ctxC, imgCTopRef.current, wC, hC, pct, 13)

      // Draw particles on top
      drawParticles(ctxP, ctxC, wP, hP, wC)

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start gap-1 select-none"
      aria-label="Perfectly Crafted"
    >
      {/* ── PERFECTLY ── */}
      <div className="relative" style={{ width: dimensionsRef.current.wP, height: dimensionsRef.current.hP }}>
        {/* Bottom: mowed/trimmed — always fully visible */}
        <img
          ref={imgPBotRef}
          src="/images/perfectly_bottom.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain object-left pointer-events-none"
          draggable={false}
        />
        {/* Top: wild grass rendered onto canvas with jagged clip */}
        <canvas
          ref={canvasPRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        />
        {/* Hidden img element so we can drawImage from it */}
        <img
          ref={imgPTopRef}
          src="/images/perfectly_top.webp"
          alt=""
          aria-hidden
          className="hidden"
          draggable={false}
        />
      </div>

      {/* ── CRAFTED ── overlapping Perfectly */}
      <div
        className="relative"
        style={{ width: dimensionsRef.current.wC, height: dimensionsRef.current.hC, marginTop: "-36px", marginLeft: "20px" }}
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
