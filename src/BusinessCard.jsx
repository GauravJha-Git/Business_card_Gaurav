import { useRef, useEffect, useCallback } from 'react'
import ParticleCanvas from './components/ParticleCanvas'
import CardFront      from './components/CardFront'
import CardBack       from './components/CardBack'
import MailButton     from './components/MailButton'

export default function BusinessCard() {
  // ── DOM refs ──
  const sceneRef      = useRef(null)
  const cardRef       = useRef(null)
  const glowBehindRef = useRef(null)
  const glowRingRef   = useRef(null)
  const glitchRef1    = useRef(null)
  const glitchRef2    = useRef(null)
  const flickerRef    = useRef(null)
  const mailWrapRef   = useRef(null)   // provided via MailButton's own ref exposure

  // ── State refs (no re-renders) ──
  const isFlippedRef    = useRef(false)
  const isHoveringRef   = useRef(false)
  const isFlippingRef   = useRef(false)
  const isTouchRef      = useRef(false)
  const entranceDoneRef = useRef(false)
  const idleAnimRef     = useRef(null)
  const glowAnimRef     = useRef(null)
  const glitchTimerRef  = useRef(null)

  // ── GSAP quickTo instances ──
  const qRotX = useRef(null)
  const qRotY = useRef(null)

  // ──────────────────────────────────────
  //   HELPERS
  // ──────────────────────────────────────

  const getFront = () => cardRef.current?.querySelector('.card-front')
  const getBack  = () => cardRef.current?.querySelector('.card-back')

  const showFace = useCallback((face) => {
    const front = getFront()
    const back  = getBack()
    if (!front || !back) return
    if (face === 'back') {
      front.style.opacity       = '0'
      front.style.pointerEvents = 'none'
      back.style.opacity        = '1'
      back.style.pointerEvents  = 'auto'
    } else {
      back.style.opacity        = '0'
      back.style.pointerEvents  = 'none'
      front.style.opacity       = '1'
      front.style.pointerEvents = 'auto'
    }
  }, [])

  // ──────────────────────────────────────
  //   IDLE ANIMATION
  // ──────────────────────────────────────

  const startIdle = useCallback(() => {
    if (isHoveringRef.current || !entranceDoneRef.current || isFlippingRef.current) return
    const gsap = window.gsap
    idleAnimRef.current = gsap.to(cardRef.current, {
      y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
    })
    glowAnimRef.current = gsap.to(glowRingRef.current, {
      boxShadow: '0 0 20px 3px rgba(139,92,246,0.28)',
      borderColor: 'rgba(139,92,246,0.38)',
      duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    })
  }, [])

  const stopIdle = useCallback(() => {
    const gsap = window.gsap
    idleAnimRef.current?.kill()
    glowAnimRef.current?.kill()
    idleAnimRef.current = null
    glowAnimRef.current = null
    gsap.to(glowRingRef.current, {
      boxShadow: '0 0 0 0 rgba(139,92,246,0)',
      borderColor: 'rgba(139,92,246,0)',
      duration: 0.3,
    })
  }, [])

  // ──────────────────────────────────────
  //   GLITCH
  // ──────────────────────────────────────

  const triggerGlitch = useCallback(() => {
    const gsap   = window.gsap
    const strips = [glitchRef1.current, glitchRef2.current]
    const count  = Math.random() > 0.4 ? 2 : 1

    for (let i = 0; i < count; i++) {
      const strip = strips[i]
      if (!strip) continue
      const y     = 30 + Math.random() * (window.innerHeight - 60)
      const h     = 5  + Math.random() * 14
      const shift = (5 + Math.random() * 8) * (Math.random() > 0.5 ? 1 : -1)

      gsap.set(strip, { top: y, height: h, opacity: 0.85, x: 0 })
      gsap.to(strip, {
        x: shift, duration: 0.05, yoyo: true, repeat: 3,
        onComplete: () => gsap.set(strip, { opacity: 0, height: 0 }),
      })
    }

    // Violet aberration flash on card
    if (cardRef.current) {
      gsap.timeline()
        .to(cardRef.current, { filter: 'brightness(1.12) hue-rotate(8deg)', duration: 0.05 })
        .to(cardRef.current, { filter: 'brightness(1) hue-rotate(0deg)',    duration: 0.05 })
    }

    // Occasional full-screen flicker
    if (Math.random() < 0.35 && flickerRef.current) {
      gsap.timeline()
        .to(flickerRef.current, { opacity: 0.07, duration: 0.04 })
        .to(flickerRef.current, { opacity: 0,    duration: 0.04 })
    }
  }, [])

  const scheduleGlitch = useCallback(() => {
    const delay = 7000 + Math.random() * 5000
    glitchTimerRef.current = setTimeout(() => {
      triggerGlitch()
      scheduleGlitch()
    }, delay)
  }, [triggerGlitch])

  // ──────────────────────────────────────
  //   TILT
  // ──────────────────────────────────────

  const handleMouseMove = useCallback((e) => {
    if (isTouchRef.current || isFlippingRef.current || !entranceDoneRef.current) return
    const gsap = window.gsap
    const rect  = cardRef.current.getBoundingClientRect()
    const cx    = rect.left + rect.width  / 2
    const cy    = rect.top  + rect.height / 2
    const dx    = (e.clientX - cx) / (rect.width  / 2) // -1 to 1
    const dy    = (e.clientY - cy) / (rect.height / 2)

    qRotX.current?.(-dy * 12)
    qRotY.current?.( dx * 18)

    // Move glare opposite to tilt
    const gx = 50 - dx * 28
    const gy = 50 - dy * 28
    const activeGlare = (isFlippedRef.current ? getBack() : getFront())?.querySelector('.glare')
    if (activeGlare) {
      gsap.to(activeGlare, {
        background: `radial-gradient(ellipse 60% 50% at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, transparent 70%)`,
        duration: 0.4,
      })
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current) return
    isHoveringRef.current = true
    stopIdle()
    window.gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: 'power2.out' })
  }, [stopIdle])

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current || isFlippingRef.current) return
    const gsap = window.gsap
    isHoveringRef.current = false

    gsap.to(cardRef.current, {
      rotationX: 0, rotationY: 0,
      duration: 1.2, ease: 'elastic.out(1, 0.5)',
      onComplete: startIdle,
    })

    // Reset active glare
    const activeGlare = (isFlippedRef.current ? getBack() : getFront())?.querySelector('.glare')
    if (activeGlare) {
      const defaultBg = isFlippedRef.current
        ? 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(139,92,246,0.05) 0%, transparent 70%)'
        : 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,255,255,0.07) 0%, transparent 70%)'
      gsap.to(activeGlare, { background: defaultBg, duration: 0.5 })
    }
  }, [startIdle])

  // ──────────────────────────────────────
  //   FLIP
  // ──────────────────────────────────────

  const handleFlip = useCallback((e) => {
    if (
      e.target.closest('.icon-link')   ||
      e.target.closest('.contact-row') ||
      e.target.closest('.mail-btn-wrap') ||
      isFlippingRef.current
    ) return
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return

    const gsap = window.gsap
    isFlippingRef.current = true
    stopIdle()

    // Phase 1: rotate to edge-on
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 90,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        // Swap face
        const nextFace = isFlippedRef.current ? 'front' : 'back'
        showFace(nextFace)
        isFlippedRef.current = !isFlippedRef.current

        // Fire glitch at the swap moment
        triggerGlitch()

        // Phase 2: rotate back from other side
        gsap.fromTo(cardRef.current,
          { rotationY: -90 },
          {
            rotationY: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              isFlippingRef.current = false
              if (!isHoveringRef.current) startIdle()
            },
          }
        )
      },
    })
  }, [stopIdle, startIdle, showFace, triggerGlitch])

  // ──────────────────────────────────────
  //   MOUNT — entrance timeline + setup
  // ──────────────────────────────────────

  useEffect(() => {
    const gsap  = window.gsap
    const card  = cardRef.current
    const scene = sceneRef.current

    // Touch detection
    const detectTouch = (e) => { if (e.pointerType === 'touch') isTouchRef.current = true }
    window.addEventListener('pointerdown', detectTouch, { once: true })

    // QuickTo for tilt
    qRotX.current = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' })
    qRotY.current = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' })

    // Set initial states
    gsap.set(card, { opacity: 0, scale: 0.85, y: 40 })
    gsap.set('.mail-btn-wrap', { opacity: 0, y: 16 })
    gsap.set('.icon-link', { opacity: 0, y: 8 })
    gsap.set('.letter', { opacity: 0, y: 20 })

    // ── Entrance timeline ──
    const tl = gsap.timeline({
      onComplete: () => {
        entranceDoneRef.current = true
        startIdle()
        scheduleGlitch()
      },
    })

    // 1. Particle canvas fades in
    tl.to('#particle-canvas', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0)

    // 2. Glow behind breathes in
    tl.fromTo(glowBehindRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
      0.1
    )

    // 3. Card snaps in
    tl.to(card, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.3)

    // 4. Name letters stagger
    tl.to('.letter', {
      opacity: 1, y: 0,
      duration: 0.55, stagger: 0.032, ease: 'power3.out',
    }, 0.55)

    // 5. Icons stagger
    tl.to('.icon-link', {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.08, ease: 'power2.out',
    }, 0.78)

    // 6. Button fades in
    tl.to('.mail-btn-wrap', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.2)

    // ── Glow behind breathing ──
    gsap.to(glowBehindRef.current, {
      scale: 1.15, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.5,
    })

    return () => {
      clearTimeout(glitchTimerRef.current)
      window.removeEventListener('pointerdown', detectTouch)
      tl.kill()
      idleAnimRef.current?.kill()
      glowAnimRef.current?.kill()
      gsap.ticker.remove(() => {})
    }
  }, [startIdle, scheduleGlitch])

  return (
    <>
      {/* Layer 1: Particles */}
      <ParticleCanvas />

      {/* Layer 2: Scanlines + Vignette + Glitch overlays */}
      <div className="scanlines-overlay" />
      <div className="vignette-overlay" />
      <div className="flicker-overlay" ref={flickerRef} />
      <div className="glitch-strip" ref={glitchRef1} />
      <div className="glitch-strip" ref={glitchRef2} />

      {/* Layer 3: Main content */}
      <div className="page">
        <div
          className="scene"
          ref={sceneRef}
          onMouseMove={handleMouseMove}
        >
          {/* Radial glow behind card */}
          <div className="glow-behind" ref={glowBehindRef} />

          {/* Card */}
          <div
            ref={cardRef}
            className="card-container"
            role="button"
            tabIndex={0}
            aria-label="Business card — click to flip"
            onClick={handleFlip}
            onKeyDown={handleFlip}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={e => e.preventDefault()}
          >
            <div className="card-glow-ring" ref={glowRingRef} />
            <CardFront />
            <CardBack />
          </div>
        </div>

        {/* Mail button */}
        <MailButton />
      </div>
    </>
  )
}
