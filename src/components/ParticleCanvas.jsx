import { useRef, useEffect } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const gsap   = window.gsap
    const mobile = window.innerWidth < 768 || navigator.maxTouchPoints > 1
    const COUNT  = mobile ? 60 : 120

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(document.documentElement)

    // Build particles
    const particles = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      0,
      vy:      0,
      baseVx:  (Math.random() - 0.5) * 0.22,
      baseVy:  (Math.random() - 0.5) * 0.22,
      opacity: 0.15 + Math.random() * 0.25,
      radius:  0.8 + Math.random() * 1.3,
      violet:  Math.random() > 0.62,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update
      for (const p of particles) {
        const dx   = p.x - mx
        const dy   = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120 && dist > 0) {
          const f = ((120 - dist) / 120) * 0.38
          p.vx += (dx / dist) * f
          p.vy += (dy / dist) * f
        }
        p.vx *= 0.96
        p.vy *= 0.96
        p.x  += p.vx + p.baseVx
        p.y  += p.vy + p.baseVy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(200,200,255,${0.045 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.violet
          ? `rgba(139,92,246,${p.opacity})`
          : `rgba(255,255,255,${p.opacity})`
        ctx.fill()
      }
    }

    gsap.ticker.add(tick)

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMove)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      id="particle-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0, opacity: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
