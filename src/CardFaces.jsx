import { useRef, useEffect } from 'react'
import {
  GithubIcon, LinkedInIcon, PortfolioIcon, EmailIcon,
  PhoneIcon, LocationIcon
} from './Icons'

// ─── Geometric dot-matrix accent ───
const GeoAccent = () => (
  <div className="geo-accent">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.35">
        {[6,14,22,30,38].map((x, xi) =>
          [6,14,22,30,38].map((y, yi) => {
            const dist = Math.sqrt(xi * xi + yi * yi)
            const opacity = Math.max(0.15, 1 - dist * 0.22)
            return (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5"
                fill="#8B5CF6" fillOpacity={opacity} />
            )
          })
        )}
      </g>
      {/* Corner accent lines */}
      <line x1="36" y1="36" x2="48" y2="36" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.9" />
      <line x1="48" y1="36" x2="48" y2="48" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.9" />
    </svg>
  </div>
)

// ─── Magnetic icon link ───
const MagneticLink = ({ href, id, label, children }) => {
  const ref = useRef(null)
  const gsap = window.gsap

  const handleMouseEnter = () => {
    gsap.to(ref.current, {
      scale: 1.25,
      color: '#8B5CF6',
      filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.7))',
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      scale: 1, x: 0, y: 0,
      color: 'rgba(240,240,240,0.45)',
      filter: 'drop-shadow(0 0 0px rgba(139,92,246,0))',
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseMove = (e) => {
    const r  = ref.current.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    gsap.to(ref.current, {
      x: (e.clientX - cx) * 0.35,
      y: (e.clientY - cy) * 0.35,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  return (
    <a
      ref={ref}
      id={id}
      className="icon-link"
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </a>
  )
}

// ─── FRONT FACE ───
export const CardFront = ({ glareRef }) => (
  <div className="card-face card-front">
    <div className="glare" ref={glareRef} />

    {/* Top row */}
    <div className="front-top">
      <div className="name-block">
        <div className="name-main">Gaurav Jha</div>
        <div className="name-alias">// Mikey</div>
      </div>
      <GeoAccent />
    </div>

    {/* Middle */}
    <div className="front-middle">
      <div className="role-line">
        Full-Stack Dev &amp; Designer
        <span className="role-separator">·</span>
        AI/ML Student
      </div>
      <div className="oneliner">"Building real things. Quietly."</div>
      <div className="location-line">
        <LocationIcon />
        Prayagraj, India
      </div>
    </div>

    {/* Icon row */}
    <div className="icon-row">
      <MagneticLink id="icon-github" href="https://github.com/GauravJha-Git" label="GitHub">
        <GithubIcon />
      </MagneticLink>
      <MagneticLink id="icon-linkedin" href="https://www.linkedin.com/in/gaurav-jha09/" label="LinkedIn">
        <LinkedInIcon />
      </MagneticLink>
      <MagneticLink id="icon-portfolio" href="https://personal-portfolio-nextjs-sepia.vercel.app/" label="Portfolio">
        <PortfolioIcon />
      </MagneticLink>
      <MagneticLink id="icon-email" href="mailto:gauravjha092006@gmail.com" label="Email">
        <EmailIcon />
      </MagneticLink>

      <div className="flip-hint">
        <span>flip</span>
        <span>↺</span>
      </div>
    </div>
  </div>
)

// ─── BACK FACE ───
export const CardBack = ({ glareRef }) => (
  <div className="card-face card-back">
    <div className="glare" ref={glareRef} />

    <div className="back-headline">
      Let&apos;s <span>connect.</span>
    </div>

    <div className="contact-list">
      <a className="contact-item" href="mailto:gauravjha092006@gmail.com" onClick={e => e.stopPropagation()}>
        <EmailIcon className="ci-icon" />
        <span className="contact-label">email</span>
        <span>gauravjha092006@gmail.com</span>
      </a>
      <a className="contact-item" href="tel:+919523391106" onClick={e => e.stopPropagation()}>
        <PhoneIcon className="ci-icon" />
        <span className="contact-label">phone</span>
        <span>+91 9523391106</span>
      </a>
      <a className="contact-item" href="https://www.linkedin.com/in/gaurav-jha09/" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        <LinkedInIcon className="ci-icon" />
        <span className="contact-label">linkedin</span>
        <span>/in/gaurav-jha09</span>
      </a>
      <a className="contact-item" href="https://github.com/GauravJha-Git" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        <GithubIcon className="ci-icon" />
        <span className="contact-label">github</span>
        <span>/GauravJha-Git</span>
      </a>
      <a className="contact-item" href="https://personal-portfolio-nextjs-sepia.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
        <PortfolioIcon className="ci-icon" />
        <span className="contact-label">portfolio</span>
        <span>vercel.app ↗</span>
      </a>
    </div>

    <div className="back-personality">
      "Deep into philosophy and cinema. Also the guy with goofy glasses at McDonald's. Both are real."
    </div>
  </div>
)
