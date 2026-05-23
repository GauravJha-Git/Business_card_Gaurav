import { useRef } from 'react'

// ─── Magnetic icon link ───
function MagneticLink({ href, id, label, children, isMailto }) {
  const ref  = useRef(null)
  const gsap = window.gsap

  const onEnter = () => {
    gsap.to(ref.current, {
      scale: 1.3,
      color: '#8B5CF6',
      filter: 'drop-shadow(0 0 7px rgba(139,92,246,0.75))',
      duration: 0.18, ease: 'power2.out',
    })
  }
  const onLeave = () => {
    gsap.to(ref.current, {
      scale: 1, x: 0, y: 0,
      color: 'rgba(240,240,240,0.38)',
      filter: 'drop-shadow(0 0 0px rgba(139,92,246,0))',
      duration: 0.35, ease: 'elastic.out(1,0.5)',
    })
  }
  const onMove = (e) => {
    const r  = ref.current.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const d  = Math.sqrt(dx * dx + dy * dy)
    if (d < 40) {
      gsap.to(ref.current, { x: dx * 0.4, y: dy * 0.4, duration: 0.15, ease: 'power2.out' })
    }
  }

  return (
    <a
      ref={ref} id={id}
      className="icon-link"
      href={href}
      target={isMailto ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={label} title={label}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </a>
  )
}

// ─── SVG Icons (inline) ───
const IconGithub = () => (
  <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
)
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)
const IconPortfolio = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
)
const IconEmail = () => (
  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
)

export default function CardFront() {
  const nameLetters = "GAURAV JHA".split('').map((ch, i) =>
    <span key={i} className="letter">{ch === ' ' ? '\u00A0' : ch}</span>
  )

  return (
    <div className="card-face card-front">
      {/* Glare — managed by BusinessCard via querySelector */}
      <div className="glare" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,255,255,0.07) 0%, transparent 70%)' }} />

      {/* Top row */}
      <div className="front-top">
        <div className="name-block">
          <div className="name-main">{nameLetters}</div>
          <div className="name-alias">// mikey</div>
        </div>

        {/* Dot grid + vertical line */}
        <div className="geo-accent-wrap">
          <div className="dot-grid">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className="dot-grid-dot" style={{ opacity: 0.15 + (15 - i) / 15 * 0.35 }} />
            ))}
          </div>
          <div className="accent-vline" />
        </div>
      </div>

      {/* Middle */}
      <div className="front-middle">
        <div className="role-line">
          Full-Stack Dev &amp; Designer<span className="role-sep">·</span>AI/ML Student
        </div>
        <div className="oneliner">"Building real things. Quietly."</div>
        <div className="location-line">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
          Prayagraj, India
        </div>
      </div>

      {/* Icon row */}
      <div className="icon-row">
        <MagneticLink id="icon-github"    href="https://github.com/GauravJha-Git"                        label="GitHub"><IconGithub /></MagneticLink>
        <MagneticLink id="icon-linkedin"  href="https://www.linkedin.com/in/gaurav-jha09/"                label="LinkedIn"><IconLinkedIn /></MagneticLink>
        <MagneticLink id="icon-portfolio" href="https://personal-portfolio-nextjs-sepia.vercel.app/"     label="Portfolio"><IconPortfolio /></MagneticLink>
        <MagneticLink id="icon-email"     href="mailto:gauravjha092006@gmail.com" isMailto label="Email"><IconEmail /></MagneticLink>

        <div className="flip-hint"><span>flip</span><span>↺</span></div>
      </div>
    </div>
  )
}
