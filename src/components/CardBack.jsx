import { useRef } from 'react'
import { openMailWithFallback } from '../utils/openMail'

// Contact row with slide hover
function ContactRow({ href, text, isMailto, isTel, onClick }) {
  const ref  = useRef(null)
  const gsap = window.gsap

  const onEnter = () => gsap.to(ref.current, { x: 4, color: '#fff', duration: 0.2, ease: 'power2.out' })
  const onLeave = () => gsap.to(ref.current, { x: 0, color: '#bbb', duration: 0.45, ease: 'elastic.out(1,0.4)' })

  const target = isMailto || isTel ? undefined : '_blank'

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick(e)
  }

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={target ? 'noopener noreferrer' : undefined}
      className="contact-row"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      <span className="chevron">›</span>
      <span>{text}</span>
    </a>
  )
}

export default function CardBack() {
  return (
    <div className="card-face card-back">
      {/* Glare */}
      <div className="glare" style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

      {/* Diagonal line */}
      <div className="back-diagonal">
        <svg width="100%" height="100%" viewBox="0 0 480 290" preserveAspectRatio="none" style={{ position:'absolute', inset:0 }}>
          <line x1="420" y1="0" x2="60" y2="290" stroke="#8B5CF6" strokeWidth="1" opacity="0.13" />
        </svg>
      </div>

      {/* Spine label (right edge, reads top→bottom) */}
      <div className="spine-label">GAURAV JHA · 2025</div>

      {/* Big headline */}
      <div className="back-headline">
        <div className="bh-top">LET'S</div>
        <div className="bh-bot">TALK.</div>
      </div>

      {/* Contact list */}
      <div className="contact-list">
        <ContactRow
          href="mailto:gauravjha092006@gmail.com"
          text="gauravjha092006@gmail.com"
          onClick={openMailWithFallback}
        />
        <ContactRow href="tel:+919523391106"                text="+91-9523391106"             isTel />
        <ContactRow href="https://www.linkedin.com/in/gaurav-jha09/"               text="linkedin.com/in/gaurav-jha09" />
        <ContactRow href="https://github.com/GauravJha-Git"                        text="github.com/GauravJha-Git" />
        <ContactRow href="https://personal-portfolio-nextjs-sepia.vercel.app/"     text="personal-portfolio.vercel.app" />
      </div>

      {/* Personality micro-text */}
      <div className="back-personality">
        "Debugging reality since 2006. Patch notes pending."
      </div>
    </div>
  )
}
