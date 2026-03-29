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
  x: number,
  w: number,
  h: number,
  roughness: number,
  segments: number,
): Path2D {
  const path = new Path2D()
  path.moveTo(0, 0)
  path.lineTo(x, 0)
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const py = t * h
    const jitter =
      Math.sin(t * 11.3 + 1.2) * roughness * 0.6 +
      Math.sin(t * 23.7 + 0.5) * roughness * 0.4
    path.lineTo(x + jitter, py)
  }
  path.lineTo(0, h)
  path.closePath()
  return path
}

// Sample the jagged edge x positions at intervals down the height
function sampleEdgePoints(cutX: number, h: number, roughness: number, segments: number): Array<{x: number, y: number}> {
  const pts: Array<{x: number, y: number}> = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const py = t * h
    const jitter =
      Math.sin(t * 11.3 + 1.2) * roughness * 0.6 +
      Math.sin(t * 23.7 + 0.5) * roughness * 0.4
    pts.push({ x: cutX + jitter, y: py })
  }
  return pts
}

interface Particle {
  x: number       // position in container coords
  y: number
  vx: number
  vy: number
  rotation: number
  rotSpeed: number
  width: number
  height: number
  color: string
  alpha: number
  decay: number
}

const GRASS_COLORS = [
  "#4a7c2f", "#5a9e3a", "#3d6b28", "#6ab04c",
  "#7ec850", "#4e8c35", "#2d5a20", "#89d45a",
]

function spawnParticles(
  particles: Particle[],
  edgePoints: Array<{x: number, y: number}>,
  // offset in container-space so particles from Crafted are shifted down
  yOffset: number,
  // scale factor: canvas logical px -> container CSS px
  scaleX: number,
  scaleY: number,
  moving: boolean,
) {
  if (!moving) return
  // Pick ~3 random edge points and emit a clipping from each
  const count = 3
  for (let i = 0; i < count; i++) {
    const pt = edgePoints[Math.floor(Math.random() * edgePoints.length)]
    const color = GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)]
    particles.push({
      x: pt.x * scaleX,
      y: pt.y * scaleY + yOffset,
      vx: (Math.random() - 0.3) * 2.5,
      vy: -(Math.random() * 3 + 1.5),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      width:  Math.random() * 6 + 3,
      height: Math.random() * 2 + 1,
      color,
      alpha: 0.9,
      decay: Math.random() * 0.02 + 0.015,
    })
  }
}

export function GrassReveal() {
  const canvasPRef    = useRef<HTMLCanvasElement>(null)
  const canvasCRef    = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgPTopRef    = useRef<HTMLImageElement>(null)
  const imgCTopRef    = useRef<HTMLImageElement>(null)
  const imgPBotRef    = useRef<HTMLImageElement>(null)
  const imgCBotRef    = useRef<HTMLImageElement>(null)
  const rafRef        = useRef<number | null>(null)
  const particlesRef  = useRef<Particle[]>([])
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
    const canvasPart = particleCanvasRef.current
    if (!canvasP || !canvasC || !canvasPart) return

    const ctxP    = canvasP.getContext("2d")
    const ctxC    = canvasC.getContext("2d")
    const ctxPart = canvasPart.getContext("2d")
    if (!ctxP || !ctxC || !ctxPart) return

    const wP = dimensionsRef.current.wP
    const hP = dimensionsRef.current.hP
    const wC = dimensionsRef.current.wC
    const hC = dimensionsRef.current.hC

    canvasP.width  = wP
    canvasP.height = hP
    canvasC.width  = wC
    canvasC.height = hC

    let startTime: number | null = null
    let lastPct = 0

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

    function drawParticles(pw: number, ph: number) {
      // Particle canvas covers the full stacked height of both words
      pw = canvasPart.width
      ph = canvasPart.height
      ctxPart.clearRect(0, 0, pw, ph)

      for (const p of particlesRef.current) {
        ctxPart.save()
        ctxPart.globalAlpha = Math.max(0, p.alpha)
        ctxPart.translate(p.x, p.y)
        ctxPart.rotate(p.rotation)
        ctxPart.fillStyle = p.color
        ctxPart.beginPath()
        // Draw a slim grass-blade ellipse
        ctxPart.ellipse(0, 0, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
        ctxPart.fill()
        ctxPart.restore()
      }
    }

    function animate(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = (ts - startTime) % (TOTAL * 2)

      let pct: number
      let inPause: boolean
      let movingRight: boolean

      if (elapsed < TOTAL) {
        const t = Math.min(elapsed / DURATION, 1)
        pct = ease(t) * 100
        inPause = elapsed > DURATION
        movingRight = true
      } else {
        const t = Math.min((elapsed - TOTAL) / DURATION, 1)
        pct = (1 - ease(t)) * 100
        inPause = (elapsed - TOTAL) > DURATION
        movingRight = false
      }

      const moving = !inPause && Math.abs(pct - lastPct) > 0.05
      const spawnParticles_flag = moving && !movingRight  // Only spawn when moving LEFT

      // Resize particle canvas to match the outer container on each frame
      const container = canvasPart.parentElement
      if (container) {
        const cw = container.offsetWidth
        const ch = container.offsetHeight
        if (canvasPart.width !== cw || canvasPart.height !== ch) {
          canvasPart.width  = cw
          canvasPart.height = ch
        }
      }

      // Draw clipped top images
      drawWord(ctxP, imgPTopRef.current, wP, hP, pct, 10)
      drawWord(ctxC, imgCTopRef.current, wC, hC, pct, 13)

      // Spawn particles at the cut edge of each word when moving LEFT
      if (spawnParticles_flag) {
        // Perfectly: the word canvas fills the top portion of the container
        const pWordEl = canvasP.parentElement
        const cWordEl = canvasC.parentElement
        const container = canvasPart.parentElement

        if (pWordEl && container) {
          const scaleX = pWordEl.offsetWidth  / wP
          const scaleY = pWordEl.offsetHeight / hP
          const yOff   = pWordEl.offsetTop
          const edgePts = sampleEdgePoints(pct * wP * 0.01, hP, 10, 40)
          spawnParticles(particlesRef.current, edgePts, yOff, scaleX, scaleY, spawnParticles_flag)
        }
        if (cWordEl && container) {
          const scaleX = cWordEl.offsetWidth  / wC
          const scaleY = cWordEl.offsetHeight / hC
          const yOff   = cWordEl.offsetTop
          const edgePts = sampleEdgePoints(pct * wC * 0.01, hC, 13, 40)
          spawnParticles(particlesRef.current, edgePts, yOff, scaleX, scaleY, spawnParticles_flag)
        }
      }

      // Update & cull particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0)
      for (const p of particlesRef.current) {
        p.x        += p.vx
        p.y        += p.vy
        p.vy       += 0.12    // gravity
        p.rotation += p.rotSpeed
        p.alpha    -= p.decay
      }

      drawParticles(canvasPart.width, canvasPart.height)

      lastPct = pct
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-start select-none" style={{ maxWidth: 380 }} aria-label="Perfectly Crafted">
      {/* Particle overlay — covers full stacked area of both words */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden
      />
      {/* ── PERFECTLY ── */}
      <div className="relative w-full" style={{ aspectRatio: "980 / 270" }}>
        <img
          ref={imgPBotRef}
          src="/images/perfectly_bottom.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none"
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

      {/* ── CRAFTED ── overlapping Perfectly */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "1100 / 350", marginTop: "-5%", marginLeft: "5%" }}
      >
        <img
          ref={imgCBotRef}
          src="/images/crafted_bottom.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none"
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
